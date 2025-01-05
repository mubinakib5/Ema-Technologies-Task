"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLimit } from "@/redux/slices/limitSlice";
import styles from "./LimitSetter.module.css";

export default function LimitSetter() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    dispatch(
      setLimit({
        category,
        amount: parseFloat(amount),
      })
    );
    setAmount("");
  };

  return (
    <div className={styles.limitSetter}>
      <h2>SET YOUR LIMIT</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Insert an amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.amountInput}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="Groceries">Groceries</option>
          <option value="Transport">Transport</option>
          <option value="HealthCare">HealthCare</option>
          <option value="Utility">Utility</option>
          <option value="Charity">Charity</option>
        </select>
        <button type="submit" className={styles.submitButton}>
          Set Limit
        </button>
      </form>
    </div>
  );
}
