"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { formatter } from "@/lib/utils"; // Asegúrate de importar el formateador

export type ProductColumn = {
  id: string;
  name: string;
  price: number;
  size?: string;
  category: string;
  flavor?: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      return formatter.format(row.getValue("price")); // Formatea el precio aquí
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "size",
    header: "Presentación",
  },
  {
    accessorKey: "flavor",
    header: "Variedad",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];