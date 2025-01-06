import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Expense from "@/models/Expense";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const expense = await Expense.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
