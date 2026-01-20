import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const prisma = await getPrisma();
    const lists = await prisma.shoppingList.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json(
      { error: "Failed to fetch lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, isPrivate = false, password } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (isPrivate && (!password || typeof password !== "string" || password.trim() === "")) {
      return NextResponse.json(
        { error: "Password is required for private lists" },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();
    const list = await prisma.shoppingList.create({
      data: {
        name: name.trim(),
        isPrivate,
        password: isPrivate ? password.trim() : null,
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500 }
    );
  }
}
