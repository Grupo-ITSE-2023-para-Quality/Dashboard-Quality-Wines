"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  isPaid: boolean;
  totalPrice: string;
  products: { name: string; quantity: number; productId: string }[];
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Productos",
    cell: ({ row }) => (
      <div className="flex flex-col space-y-1">
        {row.original.products.map((product, index) => (
          <div key={index} className="flex justify-between">
            <span>{product.name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "products.quantity",
    header: "Cantidad",
    cell: ({ row }) => (
      <div className="flex flex-col space-y-1">
        {row.original.products.map((product, index) => (
          <div key={index}>{product.quantity}</div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
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
    header: "Estado del Pedido",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
