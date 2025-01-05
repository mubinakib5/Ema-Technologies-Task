import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Limit from "@/models/Limit";

export async function GET() {
  console.log("Fetching limits...");
  try {
    await connectDB();
    const limits = await Limit.find();
    console.log(`Found ${limits.length} limits`);
    return NextResponse.json(limits);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch limits" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  console.log("Setting new limit...");
  try {
    await connectDB();
    const { category, amount } = await request.json();
    console.log("Limit data:", { category, amount });

    const limit = await Limit.findOneAndUpdate(
      { category },
      { amount },
      { upsert: true, new: true }
    );

    console.log("Updated/Created limit:", limit);
    return NextResponse.json(limit);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to set limit" }, { status: 500 });
  }
}
