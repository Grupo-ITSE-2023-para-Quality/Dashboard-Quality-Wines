import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Manejo de solicitudes OPTIONS para CORS
export async function OPTIONS(req: Request) {
  return NextResponse.json(null, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      stock, // Asegúrate de que stock esté incluido
      minStock,
      categoryId,
      sizeId,
      images,
      isFeatured,
      isArchived,
      description,
      flavorId,
    } = body;

    if (!userId) {
      return new NextResponse("No identificado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("El nombre es obligatorio", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("La imagen es obligatoria", { status: 400 });
    }

    if (!price) {
      return new NextResponse("El precio es obligatorio", { status: 400 });
    }

    if (stock === undefined) { // Verifica que stock esté definido
      return new NextResponse("El stock es obligatorio", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("La categoría es obligatoria", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Sin autorización", { status: 403 });
    }

    // Calcular el valor de inStock
    const inStock = stock > 0;

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        stock, 
        minStock, 
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        flavorId,
        description: description || "",
        storeId: params.storeId,
        inStock, 
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })), // Crear múltiples imágenes
          },
        },
      },
    });

    return NextResponse.json(product); // Retorna el producto creado
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const flavorId = searchParams.get("flavorId") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true" ? true : undefined;
    const billboardId = searchParams.get("billboardId");

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Id de tienda es obligatorio" },
        { status: 400 }
      );
    }

    // Obtener categorías relacionadas al billboard
    let categoryIds: string[] = [];
    if (billboardId) {
      const categories = await prismadb.category.findMany({
        where: {
          billboardId: billboardId,
        },
        select: {
          id: true,
        },
      });
      categoryIds = categories.map((category) => category.id);
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        isArchived: false,
        isFeatured: isFeatured,
        ...(categoryId && { categoryId }), // Si categoryId está presente, filtra por él
        ...(billboardId && !categoryId ? { 
          category: { 
            billboardId: billboardId 
          } 
        } : {}), // Si solo hay billboardId y no categoryId, filtra por billboard
        sizeId,
        flavorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(products, {
      headers: {
        'Access-Control-Allow-Origin': `${process.env.FRONTEND_STORE_URL}`,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { message: "Error interno" },
      { status: 500 }
    );
  }
}