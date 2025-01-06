"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLimit } from "@/redux/slices/limitSlice";
import styles from "./LimitSetter.module.css";

export default function LimitSetter() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) {
      setError("Please enter a budget limit amount");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      await dispatch(
        setLimit({
          category,
          amount: parseFloat(amount),
        })
      ).unwrap();

      setAmount("");
      setStatus("success");

      // Reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setError("Failed to set budget limit. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className={styles.limitSetter}>
      <h2>Set Monthly Budget Limits</h2>
      {error && <div className={styles.error}>{error}</div>}
      {status === "success" && (
        <div className={styles.success}>Budget limit set successfully!</div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.amountInput}
          min="0"
          step="0.01"
          disabled={status === "submitting"}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
          aria-label="Select expense category"
          disabled={status === "submitting"}
        >
          <option value="Groceries">Groceries</option>
          <option value="Transport">Transportation</option>
          <option value="HealthCare">Healthcare</option>
          <option value="Utility">Utilities</option>
          <option value="Charity">Charitable Giving</option>
        </select>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Setting Limit..." : "Set Budget Limit"}
        </button>
      </form>
    </div>
  );
}
