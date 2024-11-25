import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      // Multiplica el precio del producto por la cantidad del orderItem
      return orderSum + (item.price * item.quantity);
    }, 0);

    return total + orderTotal; // Suma el total de esta orden al total general
  }, 0);

  return totalRevenue;
};