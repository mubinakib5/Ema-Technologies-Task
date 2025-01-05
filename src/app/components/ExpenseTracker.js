"use client";
import { useState } from "react";
import LimitSetter from "./LimitSetter";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import ExpenseSummary from "./ExpenseSummary";

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="expense-tracker">
      <nav className="tabs">
        <button
          className={`tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Expense
        </button>
        <button
          className={`tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
      </nav>

      <LimitSetter />

      {activeTab === "add" ? (
        <ExpenseForm />
      ) : (
        <>
          <ExpenseSummary />
          <ExpenseTable />
        </>
      )}
    </div>
  );
}
