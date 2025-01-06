"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  deleteExpense,
  updateExpense,
} from "@/redux/slices/expenseSlice";
import styles from "./ExpenseTable.module.css";

export default function ExpenseTable() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.expenses);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    month: "all",
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditForm(expense);
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateExpense({ id: editingId, ...editForm })).unwrap();
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExpense(deleteId)).unwrap();
      setShowDeleteDialog(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading expenses...</div>;
  }

  if (status === "failed") {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.empty}>
        No expenses found. Add some expenses to see them here.
      </div>
    );
  }

  // Filter expenses
  const filteredExpenses = items.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const monthMatch =
      filters.month === "all" ||
      expenseDate.getMonth() === parseInt(filters.month);
    const categoryMatch =
      filters.category === "all" || expense.category === filters.category;
    return monthMatch && categoryMatch;
  });

  // Get unique categories from expenses
  const categories = [
    "all",
    ...new Set(items.map((expense) => expense.category)),
  ];

  return (
    <div className={styles.tableContainer}>
      <h3>Recent Expenses</h3>

      <div className={styles.filters}>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories
            .filter((cat) => cat !== "all")
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>

        <select
          value={filters.month}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, month: e.target.value }))
          }
          className={styles.filterSelect}
        >
          <option value="all">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.expenseTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense._id}>
              {editingId === expense._id ? (
                <>
                  <td>
                    <input
                      type="date"
                      value={editForm.date?.split("T")[0]}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className={styles.editInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className={styles.editInput}
                    />
                  </td>
                  <td>
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className={styles.editSelect}
                    >
                      <option value="Groceries">Groceries</option>
                      <option value="Transport">Transportation</option>
                      <option value="HealthCare">Healthcare</option>
                      <option value="Utility">Utilities</option>
                      <option value="Charity">Charitable Giving</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          amount: parseFloat(e.target.value),
                        }))
                      }
                      className={styles.editInput}
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className={styles.actions}>
                    <button onClick={handleUpdate} className={styles.saveBtn}>
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className={styles.date}>
                    {new Date(expense.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>{expense.description}</td>
                  <td>
                    <span className={styles.category}>{expense.category}</span>
                  </td>
                  <td className={styles.amount}>
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => handleEdit(expense)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(expense._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteDialog && (
        <div className={styles.deleteDialog}>
          <div className={styles.dialogContent}>
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this expense?</p>
            <div className={styles.dialogActions}>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteBtn}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
