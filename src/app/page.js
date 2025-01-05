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
    return <div className="container">Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <main className="container">
        <ExpenseTracker />
      </main>
    </ErrorBoundary>
  );
}
