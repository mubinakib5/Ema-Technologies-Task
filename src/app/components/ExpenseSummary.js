"use client";
import { useSelector } from "react-redux";
import styles from "./ExpenseSummary.module.css";

export default function ExpenseSummary() {
  const expenses = useSelector((state) => state.expenses.items);
  const limits = useSelector((state) => state.limits.categories);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className={styles.summary}>
      <h3>Expense Summary</h3>
      <div className={styles.grid}>
        {Object.entries(limits).map(([category, limit]) => {
          const spent = categoryTotals[category] || 0;
          const percentage = limit ? (spent / limit) * 100 : 0;

          return (
            <div key={category} className={styles.category}>
              <h4>{category}</h4>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: percentage > 100 ? "#ff4444" : "#4CAF50",
                  }}
                />
              </div>
              <div className={styles.details}>
                <span>Spent: ${spent.toFixed(2)}</span>
                <span>Limit: ${limit.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
