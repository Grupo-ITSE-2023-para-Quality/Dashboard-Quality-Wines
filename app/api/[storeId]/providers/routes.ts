import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string} }
) {
    try {
    const { userId } = auth();
    const body = await req.json();

    const { empresa, localidad, contacto, email, comentario } = body;

    if (!userId) {
        return new NextResponse("No identificado", { status: 401 });
    }

    if (!empresa) {
        return new NextResponse("Debes ingresar el nombre de la empresa", { status: 401});
    }

    if (!localidad) {
        return new NextResponse("Ingrese la localidad", { status: 400});
    }

    if (!contacto) {
        return new NextResponse("Ingrese el contacto", { status: 400});
    }

    if (!email) {
        return new NextResponse("Ingrese el email", { status: 400});
    }

    if (!comentario) {
        return new NextResponse("Ingrese el comentario", { status: 400});
    }

    const storeByUserId = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if(!storeByUserId) {
        return new NextResponse("Sin autorización", { status: 403 });
    }

    const provider = await prismadb.provider.create({
        data: {
            empresa,
            localidad,
            contacto,
            email,
            comentario,
            storeId: params.storeId,
        },
    });

    return NextResponse.json(provider);
    }catch(error) {
        console.log("[PROVIDERS_POST]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: {storeId: string } }
) {
    try {
        if(!params.storeId) {
            return new NextResponse("El Id de tienda es obligatorio", { status: 400 });
        }

        const providers = await prismadb.provider.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(providers);
    }catch(error) {
        console.log("[PROVIDERS_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}