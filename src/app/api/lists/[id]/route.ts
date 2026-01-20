import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const password = request.nextUrl.searchParams.get("pass");

    const prisma = await getPrisma();
    const list = await prisma.shoppingList.findUnique({
      where: { shareToken: id },
      include: { items: { orderBy: { createdAt: "desc" } } },
    });

    if (!list) {
      return NextResponse.json(
        { error: "Lista não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se é privada e validar senha
    if (list.isPrivate) {
      if (!password) {
        return NextResponse.json(
          { error: "Senha necessária", requiresPassword: true, listName: list.name },
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

    return NextResponse.json({
      id: list.id,
      name: list.name,
      shareToken: list.shareToken,
      isPrivate: list.isPrivate,
      items: list.items,
    });
  } catch (error) {
    console.error("Error fetching shared list:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared list" },
      { status: 500 }
    );
  }
}
