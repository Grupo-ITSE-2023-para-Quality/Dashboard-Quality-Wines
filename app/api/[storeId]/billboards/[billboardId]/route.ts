import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Id de Billboard necesario", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
      include: {
        categories: true // Solo incluir categorías, no productos
      }
    });

    if (!billboard) {
      return new NextResponse("Billboard no encontrado", { status: 404 });
    }

    return NextResponse.json(billboard); // Devuelve solo el billboard
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl, categoryIds } = body;

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label es requerido", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("La URL de imagen es requerida", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("El id de billboard es necesario", {
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

    const billboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
        categories: {
          set: categoryIds?.map((id: string) => ({ id })) || [], // Actualiza las categorías asociadas
        },
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Id de Billboard necesario", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    //esto hace que no se pueda cambiar las tiendas de otros usuarios
    if (!storeByUserId) {
      return new NextResponse("Sin autorización", { status: 403 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
