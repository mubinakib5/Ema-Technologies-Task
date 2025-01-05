import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET() {
  console.log("Fetching expenses...");
  try {
    await connectDB();
    const expenses = await Expense.find().sort({ date: -1 });
    console.log(`Found ${expenses.length} expenses`);
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  console.log("Creating new expense...");
  try {
    await connectDB();
    const data = await request.json();
    console.log("Expense data:", data);

    const expense = await Expense.create({
      ...data,
      date: new Date(),
    });

    console.log("Created expense:", expense);
    return NextResponse.json(expense);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
