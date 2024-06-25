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

    const { name } = body;

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // This prevents changing flavors of other users
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const flavor = await prismadb.flavor.create({
      data: {
        name,
        storeId: params.storeId,
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
