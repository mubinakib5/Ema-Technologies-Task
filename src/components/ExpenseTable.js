"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "@/redux/slices/expenseSlice";
import styles from "./ExpenseTable.module.css";

export default function ExpenseTable() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.expenses);

  useEffect(() => {
    console.log("Fetching expenses in table component...");
    dispatch(fetchExpenses());
  }, [dispatch]);

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

  console.log("Current expenses:", items);

  // Group expenses by date
  const groupedExpenses = items.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(expense);
    return acc;
  }, {});

  return (
    <div className={styles.tableContainer}>
      <h3>Expense History</h3>
      <table className={styles.expenseTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map((expense) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description}</td>
              <td>${expense.amount.toFixed(2)}</td>
              <td>{expense.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
