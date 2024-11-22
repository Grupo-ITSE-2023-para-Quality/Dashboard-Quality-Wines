import { Provider } from '@prisma/client';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { providerid: string } }
) {
    try {
        if(!params.providerid) {
            return new NextResponse("Id de proveedor no proporcionado", { status: 400 });
        }

        const provider = await prismadb.provider.findUnique({
            where: {
                id: params.providerid,
            },
        });

        if(!provider) {
            return new NextResponse("Proveedor no encontrado", { status: 404 });
        }

        return NextResponse.json(provider);
    }catch(error) {
        console.log("[PROVIDER_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; providerId: string } }
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { empresa, localidad, contacto, email } = body;

        if(!userId) {
            return new NextResponse("No autenticado", { status: 401 });
        }

        if(!empresa) {
            return new NextResponse("Se requiere ingresar la empresa"), { status: 400 };
        }

        if(!localidad) {
            return new NextResponse("La localidad es obligatoria"), { status: 400 };
        }

        if(!contacto) {
            return new NextResponse("El contacto es obligatorio"), { status: 400 };
        }

        if(!email) {
            return new NextResponse("El email es obligatorio"), { status: 400 };
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if(!storeByUserId) {
            return new NextResponse("Sin autorización"), { status: 403 };
        }

        const provider = await prismadb.provider.update({
            where: {
                id: params.providerId,
            },
            data :{
                empresa,
                localidad,
                contacto,
                email,
            },
        });

        return NextResponse.json(provider);
        } catch (error) {
        console.log("[PROVIDER_PATCH]", error);
        return new NextResponse("Error interno", { status: 500 });
        }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; providerId: string } },
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("No autenticado"), { status: 401 };
        }

        if(!params.providerId) {
            return new NextResponse("El Id del proveedor es necesario"), { status: 400 };
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if(!storeByUserId) {
            return new NextResponse("Sin autorización"), { status: 403 };
        }

        return NextResponse.json(provider);
    }catch(error) {
    console.log("[PROVIDER_DELETE]", error);
    return new NextResponse("Error interno", { status: 500 });
    }
}