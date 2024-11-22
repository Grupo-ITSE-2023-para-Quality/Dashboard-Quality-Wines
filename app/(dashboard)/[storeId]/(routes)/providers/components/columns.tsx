"use client"
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProviderColumn = {
    id: string;
    empresa: string;
    localidad: string;
    contacto: string;
    comentario?: string;
    createdAt: string;
}

export const columns: ColumnDef<ProviderColumn>[] = [
    {
        accessorKey: "empresa",
        header: "Empresa",
    },
    {
        accessorKey: "direccion",
        header: "Dirección",
    },
    {
        accessorKey: "localidad",
        header: "Localidad",
    },
    {
        accessorKey: "contacto",
        header: "Contacto",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "comentario",
        header: "Comentario",
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]