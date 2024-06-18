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
      isArchived
    } = body;

    if (!userId) {
      return new NextResponse("No identificado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("El nombre es obligatorio", { status: 400 });
    }

    if(!images || !images.length) {
      return  new NextResponse("La imágen es obligatoria", { status: 400 });
    }

    if (!price) {
      return new NextResponse("El precio es obligatorio", {status: 400,});
    }

    if (!categoryId) {
      return new NextResponse("La categoría es obligatoria", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("La presentación es obligatoria", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    //esto hace que no se pueda cambiar las tiendas de otros usuarios
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
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
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
    const isFeatured = searchParams.get("isFeaturedId") || undefined;
    
    if (!params.storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
