"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "@/redux/slices/expenseSlice";
import styles from "./ExpenseForm.module.css";

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const limits = useSelector((state) => state.limits.categories);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      setError("Please fill in both amount and description");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const currentLimit = limits[category];
      if (parseFloat(amount) > currentLimit) {
        setError(
          `This expense of $${amount} exceeds your monthly budget limit of $${currentLimit} for ${category}`
        );
        setStatus("idle");
        return;
      }

      const result = await dispatch(
        addExpense({
          amount: parseFloat(amount),
          category,
          description,
        })
      ).unwrap();

      // Clear form
      setAmount("");
      setDescription("");
      setStatus("success");

      // Reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setError("Failed to record expense. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className={styles.expenseForm}>
      {error && <div className={styles.error}>{error}</div>}
      {status === "success" && (
        <div className={styles.success}>Expense recorded successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.amountInput}
          step="0.01"
          min="0"
          disabled={status === "submitting"}
          aria-label="Expense amount"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
          disabled={status === "submitting"}
          aria-label="Expense category"
        >
          <option value="Groceries">Groceries</option>
          <option value="Transport">Transportation</option>
          <option value="HealthCare">Healthcare</option>
          <option value="Utility">Utilities</option>
          <option value="Charity">Charitable Giving</option>
        </select>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.descriptionInput}
          disabled={status === "submitting"}
          aria-label="Expense description"
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Recording..." : "Record Expense"}
        </button>
      </form>
    </div>
  );
}
