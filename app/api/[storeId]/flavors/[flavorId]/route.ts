import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { flavorId: string } }
) {
  try {
    if (!params.flavorId) {
      return new NextResponse("Id de flavor es necesario", { status: 400 });
    }

    const flavor = await prismadb.flavor.findUnique({
      where: {
        id: params.flavorId,
      },
    });

    return NextResponse.json(flavor);
  } catch (error) {
    console.log("[FLAVOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; flavorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nombre es requerido", { status: 400 });
    }

    if (!params.flavorId) {
      return new NextResponse("El id de flavor es necesario", {
        status: 400,
      });
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

    const flavor = await prismadb.flavor.updateMany({
      where: {
        id: params.flavorId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(flavor);
  } catch (error) {
    console.log("[FLAVOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; flavorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No Autenticado", { status: 401 });
    }

    if (!params.flavorId) {
      return new NextResponse("Id de flavor necesario", { status: 400 });
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

    const flavor = await prismadb.flavor.deleteMany({
      where: {
        id: params.flavorId,
      },
    });

    return NextResponse.json(flavor);
  } catch (error) {
    console.log("[FLAVOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
