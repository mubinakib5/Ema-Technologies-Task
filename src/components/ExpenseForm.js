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
      setError("Please fill in all fields");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      // Check if expense exceeds category limit
      const currentLimit = limits[category];
      if (parseFloat(amount) > currentLimit) {
        setError(
          `This expense exceeds your set limit of $${currentLimit} for ${category}`
        );
        setStatus("idle");
        return;
      }

      console.log("Submitting expense:", { amount, category, description });
      const result = await dispatch(
        addExpense({
          amount: parseFloat(amount),
          category,
          description,
        })
      ).unwrap();

      console.log("Expense added successfully:", result);

      // Clear form
      setAmount("");
      setDescription("");
      setStatus("success");

      // Reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to add expense:", err);
      setError(err.message || "Failed to add expense");
      setStatus("idle");
    }
  };

  return (
    <div className={styles.expenseForm}>
      {error && <div className={styles.error}>{error}</div>}
      {status === "success" && (
        <div className={styles.success}>Expense added successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.amountInput}
          step="0.01"
          min="0"
          disabled={status === "submitting"}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
          disabled={status === "submitting"}
        >
          <option value="Groceries">Groceries</option>
          <option value="Transport">Transport</option>
          <option value="HealthCare">HealthCare</option>
          <option value="Utility">Utility</option>
          <option value="Charity">Charity</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.descriptionInput}
          disabled={status === "submitting"}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
