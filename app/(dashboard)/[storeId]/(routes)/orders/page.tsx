import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    products: item.orderItems.map((orderItem) => ({
      name: orderItem.product.name,
      quantity: orderItem.quantity, // Incluye la cantidad
    })),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price) * orderItem.quantity;
      }, 0)
    ),
    isPaid: item.isPaid,
    status: item.status,
    createdAt: format(item.createdAt, "dd-MM-yyyy"),
    name: item.name,
    lastName: item.lastName,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
