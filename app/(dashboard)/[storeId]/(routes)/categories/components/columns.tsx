"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "billboard",
    header: "Sección",
    cell: ({ row }) => row.original.billboardLabel,
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
