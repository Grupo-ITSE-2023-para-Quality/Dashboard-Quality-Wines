"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type FlavorColumn = {
  id: string;
  name: string;
  categoryName: string; 
  createdAt: string;
};

export const columns: ColumnDef<FlavorColumn>[] = [
  {
    accessorKey: "name",
    header: "Tipo",
  },
  {
    accessorKey: "category", 
    header: "Categoría",
    cell: ({ row }) => row.original.categoryName,  
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
