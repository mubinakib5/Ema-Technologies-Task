"use client";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import ExpenseTracker from "@/components/ExpenseTracker";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="container">Loading your expense tracker...</div>;
  }

  return (
    <ErrorBoundary>
      <main className="container">
        <h1 className="main-heading">
          Expense Tracking Dynamic Web Application
        </h1>
        <ExpenseTracker />
      </main>
    </ErrorBoundary>
  );
}
