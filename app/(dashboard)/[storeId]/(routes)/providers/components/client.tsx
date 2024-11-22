"use client"
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProviderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProviderClientProps {
    data: ProviderColumn[];
}

export const ProviderClient: React.FC<ProviderClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Proveedores (${data.length})`}
            description="Administrar proveedores"
            />
            <Button
            onClick={() => router.push(`/${params.storeId}/providers/new`)}
            >
            <Plus className="mr-2 h-4 w-4" />
            Añadir
            </Button>
        </div>
        <Separator />
        <DataTable searchKey="name" columns={columns} data={data} />
        <Heading title="API" description="Llamados de API para proveedores" />
        <Separator />
        <ApiList entityName="providers" entityIdName="providerId" />
        </>
    );
};