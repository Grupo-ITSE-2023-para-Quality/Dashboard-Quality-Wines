"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type SizeColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Envase",
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
