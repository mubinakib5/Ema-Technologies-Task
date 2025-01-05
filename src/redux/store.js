import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";
import limitReducer from "./slices/limitSlice";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    limits: limitReducer,
  },
});
