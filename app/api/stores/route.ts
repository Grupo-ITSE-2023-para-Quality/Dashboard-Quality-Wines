import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    if (!userId) {
      return new NextResponse("Sin autorización", { status: 401 });
    }

    if (!name) {
      return new NextResponse("El nombre es obligatorio", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
