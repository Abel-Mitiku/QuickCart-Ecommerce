import { db } from "../db";
import { Order } from "@/app/models/order";

export async function Fetchorders(userId: string) {
  try {
    await db();
    const orders = await Order.find({ userId: userId }).select(
      "productId string total status items type price quantity ",
    );
    // console.log(orders);
    let result: any[] = [];
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        result.push({
          productId: item._id,
          type: item.type,
          price: item.price,
          items: item.quantity,
          subTotal: item.subTotal,
          image: item.image,
          status: "pending",
        });
      });
    });
    console.log(result);

    return { result, success: true };
  } catch (err: any) {
    console.log(err.message);
    return { error: err.message, success: false };
  }
}
