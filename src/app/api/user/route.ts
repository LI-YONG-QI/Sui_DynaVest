import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Define transaction interface to avoid using 'any'
interface Transaction {
  hash: string;
  strategy: string;
  type: string;
  amount: string;
}

// GET - Fetch all users or a specific user by address
export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (address) {
      // Fetch a specific user by address with their transactions
      const user = await prisma.user.findUnique({
        where: { address },
        include: { txs: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    } else {
      // Fetch all users with their transactions
      const users = await prisma.user.findMany({
        include: { txs: true },
      });
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching user(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, transactions } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { address },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this address already exists" },
        { status: 409 }
      );
    }

    // Create a new user with optional transactions
    const newUser = await prisma.user.create({
      data: {
        address,
        txs: transactions
          ? {
              create: transactions.map((tx: Transaction) => ({
                hash: tx.hash,
                strategy: tx.strategy,
                type: tx.type,
                amount: tx.amount,
              })),
            }
          : undefined,
      },
      include: { txs: true },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing user or add transactions
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, transactions } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { address },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user and add new transactions if provided
    const updatedUser = await prisma.user.update({
      where: { address },
      data: {
        txs: transactions
          ? {
              create: transactions.map((tx: Transaction) => ({
                hash: tx.hash,
                strategy: tx.strategy,
                type: tx.type,
                amount: tx.amount,
              })),
            }
          : undefined,
      },
      include: { txs: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user and their transactions
export async function DELETE(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { address },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all transactions for this user first
    await prisma.tx.deleteMany({
      where: { userId: existingUser.id },
    });

    // Delete the user
    await prisma.user.delete({
      where: { address },
    });

    return NextResponse.json(
      { message: "User and associated transactions deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
