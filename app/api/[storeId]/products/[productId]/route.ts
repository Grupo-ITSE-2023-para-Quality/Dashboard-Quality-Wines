import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Id del producto es obligatorio", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        flavor: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      stock, 
      minStock,
      categoryId,
      sizeId,
      images,
      flavorId,
      description,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("El nombre es obligatorio", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("La imágen es obligatoria", { status: 400 });
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

    if (!params.productId) {
      return new NextResponse("El id del producto es obligatorio", {
        status: 400,
      });
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

    // Calcular el nuevo valor de inStock
    const inStock = stock > 0;

    // Actualizar el producto
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        stock, 
        minStock, 
        categoryId,
        sizeId,
        flavorId,
        description: description || "",
        isFeatured,
        isArchived,
        inStock, 
        images: {
          deleteMany: {}
        },
      }
    });

    // Actualizar las imágenes del producto
    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ]
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("El Id del producto necesario", { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
