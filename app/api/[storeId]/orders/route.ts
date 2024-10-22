import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400 });
    }

    const categories = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[ORDERS_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
