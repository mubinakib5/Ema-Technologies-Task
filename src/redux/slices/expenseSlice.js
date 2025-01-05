import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await fetch("/api/expenses");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch expenses");
    }
    return response.json();
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add expense");
    }

    return response.json();
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default expenseSlice.reducer;
