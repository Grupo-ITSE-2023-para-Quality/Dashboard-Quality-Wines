"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action"; // Asegúrate de importar CellAction

export type OrderColumn = {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  status: string; // Nueva propiedad
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Productos",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    accessorKey: "isPaid",
    header: "Pago efectuado",
    cell: ({ row }) => (
      <span
        className={`${
          row.original.isPaid ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.original.isPaid ? "Sí" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado del Pedido", // Nueva columna
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />, // Asegúrate de definir CellAction
  },
];
