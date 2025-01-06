"use client";
import { useState, useEffect } from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Error caught by error boundary:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div
        style={{
          padding: "20px",
          margin: "20px",
          backgroundColor: "#fff3f3",
          borderRadius: "8px",
        }}
      >
        <h2>Something went wrong</h2>
        <button
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return children;
}
