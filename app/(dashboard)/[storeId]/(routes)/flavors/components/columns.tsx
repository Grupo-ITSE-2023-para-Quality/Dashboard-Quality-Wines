"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type FlavorColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<FlavorColumn>[] = [
  {
    accessorKey: "name",
    header: "Tipo",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
