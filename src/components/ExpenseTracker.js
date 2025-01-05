"use client";
import { useState, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import LimitSetter from "./LimitSetter";
import { fetchLimits } from "@/redux/slices/limitSlice";
import { fetchExpenses } from "@/redux/slices/expenseSlice";

// Dynamically import components with loading fallbacks
const ExpenseForm = dynamic(() => import("./ExpenseForm"), {
  loading: () => <div>Loading form...</div>,
});

const ExpenseSummary = dynamic(() => import("./ExpenseSummary"), {
  loading: () => <div>Loading summary...</div>,
});

const ExpenseTable = dynamic(() => import("./ExpenseTable"), {
  loading: () => <div>Loading table...</div>,
});

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("add");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLimits());
    dispatch(fetchExpenses());
  }, [dispatch]);

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

      <Suspense fallback={<div>Loading limit setter...</div>}>
        <LimitSetter />
      </Suspense>

      {activeTab === "add" ? (
        <Suspense fallback={<div>Loading form...</div>}>
          <ExpenseForm />
        </Suspense>
      ) : (
        <>
          <Suspense fallback={<div>Loading summary...</div>}>
            <ExpenseSummary />
          </Suspense>
          <Suspense fallback={<div>Loading table...</div>}>
            <ExpenseTable />
          </Suspense>
        </>
      )}
    </div>
  );
}
