import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLimits = createAsyncThunk("limits/fetchLimits", async () => {
  const response = await fetch("/api/limits");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch limits");
  }
  return response.json();
});

export const setLimit = createAsyncThunk(
  "limits/setLimit",
  async ({ category, amount }) => {
    const response = await fetch("/api/limits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to set limit");
    }

    return response.json();
  }
);

const limitSlice = createSlice({
  name: "limits",
  initialState: {
    categories: {
      Groceries: 0,
      Transport: 0,
      HealthCare: 0,
      Utility: 0,
      Charity: 0,
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLimits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLimits.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.forEach((limit) => {
          state.categories[limit.category] = limit.amount;
        });
      })
      .addCase(fetchLimits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(setLimit.fulfilled, (state, action) => {
        state.categories[action.payload.category] = action.payload.amount;
      });
  },
});

export default limitSlice.reducer;
