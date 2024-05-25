import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request,
    { params }: {params: {storeId: string} }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("No identificado", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label es obligatorio", { status: 400 });
    }

    if (!imageUrl) {
        return new NextResponse("La URL de imagen es obligatoria", { status: 400 });
      }
    
    if (!params.storeId) {
        return new NextResponse("Id de tienda es obligatorio", { status: 400 });
      }

    const storeByUserId = await prismadb.store.findFirst({
        where:{
            id: params.storeId,
            userId
        }
    });

    //esto hace que no se pueda cambiar las tiendas de otros usuarios
    if (!storeByUserId) {
        return new NextResponse("Sin autorización", { status: 403 });
    }


    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

export async function GET(req: Request,
    { params }: {params: {storeId: string} }
) {
  try {
   if (!params.storeId) {
        return new NextResponse("Id de tienda es obligatorio", { status: 400 });
      }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
