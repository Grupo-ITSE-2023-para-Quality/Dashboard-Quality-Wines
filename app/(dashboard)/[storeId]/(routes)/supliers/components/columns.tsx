"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type SuplierColumn = {
  id: string;
  empresa: string;
  localidad: string;
  telefono: string;
  email?: string;
  comentario?: string;
  createdAt: string;
};

export const columns: ColumnDef<SuplierColumn>[] = [
  {
    accessorKey: "empresa",
    header: "Empresa",
  },
  {
    accessorKey: "localidad",
    header: "Localidad",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
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
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
