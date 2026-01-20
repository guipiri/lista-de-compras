import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const listId = request.nextUrl.searchParams.get("listId");
    const shareToken = request.nextUrl.searchParams.get("shareToken");
    const password = request.nextUrl.searchParams.get("pass");

    const prisma = await getPrisma();

    // Se tem shareToken, buscar lista compartilhada
    if (shareToken) {
      const list = await prisma.shoppingList.findUnique({
        where: { shareToken },
        include: { items: { orderBy: { createdAt: "desc" } } },
      });

      if (!list) {
        return NextResponse.json(
          { error: "Lista não encontrada" },
          { status: 404 }
        );
      }

      // Se a lista é privada, verificar senha
      if (list.isPrivate) {
        if (!password) {
          return NextResponse.json(
            { error: "Senha necessária", requiresPassword: true },
            { status: 401 }
          );
        }

        if (list.password !== password) {
          return NextResponse.json(
            { error: "Senha incorreta" },
            { status: 401 }
          );
        }
      }

      return NextResponse.json(list.items);
    }

    // Buscar lista padrão (compatibilidade com código antigo)
    if (listId) {
      const items = await prisma.shoppingItem.findMany({
        where: { listId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(items);
    }

    // Se nenhum parâmetro, retornar primeira lista ou criar uma
    let list = await prisma.shoppingList.findFirst();

    if (!list) {
      list = await prisma.shoppingList.create({
        data: { name: "Minha Lista" },
      });
    }

    const items = await prisma.shoppingItem.findMany({
      where: { listId: list.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : JSON.stringify(error);
    console.error("Error fetching items:", message);
    return NextResponse.json(
      { error: "Failed to fetch items", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, listId } = await request.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    let finalListId = listId;

    // Se não passou listId, usar a primeira lista ou criar uma
    if (!finalListId) {
      let list = await prisma.shoppingList.findFirst();
      if (!list) {
        list = await prisma.shoppingList.create({
          data: { name: "Minha Lista" },
        });
      }
      finalListId = list.id;
    }

    const item = await prisma.shoppingItem.create({
      data: {
        title: title.trim(),
        listId: finalListId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
