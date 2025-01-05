import mongoose from "mongoose";

const LimitSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Groceries", "Transport", "HealthCare", "Utility", "Charity"],
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Limit || mongoose.model("Limit", LimitSchema);
