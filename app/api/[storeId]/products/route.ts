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
    const {
      name,
      price,
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        flavorId,
        description: description || "",
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })), // Crear múltiples imágenes
          },
        },
      },
    });

    return NextResponse.json(product);
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
    const imagesParam = searchParams.get("images") || undefined; // Definir `imagesParam` correctamente
    const images = imagesParam ? imagesParam.split(',') : undefined; // Convertir el parámetro en un array

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Id de tienda es obligatorio" },
        { status: 400 }
      );
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Id de billboard es obligatorio" },
        { status: 400 }
      );
    }

    // Obtenemos las categorías del billboard
    const categories = await prismadb.category.findMany({
      where: {
        billboardId: billboardId,
      },
      select: {
        id: true,
      },
    });

    const categoryIds = categories.map((category) => category.id);

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId: categoryId || { in: categoryIds },
        sizeId,
        flavorId,
        isFeatured,
        isArchived: false,
        ...(images && {
          images: {
            some: {
              url: {
                in: images, // Usar el array de `images` para la consulta
              },
            },
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { message: "Error interno" },
      { status: 500 }
    );
  }
}


