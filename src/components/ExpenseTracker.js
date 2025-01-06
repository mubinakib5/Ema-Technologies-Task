"use client";
import { useState, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import LimitSetter from "./LimitSetter";
import { fetchLimits } from "@/redux/slices/limitSlice";
import { fetchExpenses } from "@/redux/slices/expenseSlice";

// Dynamically import components with loading fallbacks
const ExpenseForm = dynamic(() => import("./ExpenseForm"), {
  loading: () => <div>Loading expense form...</div>,
});

const ExpenseSummary = dynamic(() => import("./ExpenseSummary"), {
  loading: () => <div>Loading expense summary...</div>,
});

const ExpenseTable = dynamic(() => import("./ExpenseTable"), {
  loading: () => <div>Loading expense history...</div>,
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
          Record New Expense
        </button>
        <button
          className={`tab ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          View Summary & History
        </button>
      </nav>

      <Suspense fallback={<div>Setting up budget limits...</div>}>
        <LimitSetter />
      </Suspense>

      {activeTab === "add" ? (
        <Suspense fallback={<div>Preparing expense form...</div>}>
          <ExpenseForm />
        </Suspense>
      ) : (
        <>
          <Suspense fallback={<div>Calculating expense summary...</div>}>
            <ExpenseSummary />
          </Suspense>
          <Suspense fallback={<div>Loading expense history...</div>}>
            <ExpenseTable />
          </Suspense>
        </>
      )}
    </div>
  );
}
