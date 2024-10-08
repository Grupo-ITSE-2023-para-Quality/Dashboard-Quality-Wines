import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, categoryId } = body;

    // Verificar que el usuario esté autenticado
    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Validar los datos de entrada
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Verificar que el usuario tenga acceso a la tienda
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Crear el nuevo flavor con la relación a la categoría
    const flavor = await prismadb.flavor.create({
      data: {
        name,
        storeId: params.storeId,
        categoryId, // Asociar el flavor con la categoría
      },
    });

    return NextResponse.json(flavor);
  } catch (error) {
    console.log("[FLAVORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const flavors = await prismadb.flavor.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(flavors);
  } catch (error) {
    console.log("[FLAVORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
