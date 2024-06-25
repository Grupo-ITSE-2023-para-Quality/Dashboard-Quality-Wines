"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { FlavorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface FlavorsClientProps {
  data: FlavorColumn[];
}

export const FlavorsClient: React.FC<FlavorsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Presentaciones (${data.length})`}
          description="Administrar las variedades o sabores de los productos"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/flavors/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Llamados de API para variedades" />
      <Separator />
      <ApiList entityName="flavors" entityIdName="flavorId" />
    </>
  );
};
