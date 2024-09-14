import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import orderModel from "./order.model";
import { ProductModel } from "../products/product.model";

const orders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const result = await orderModel
        .find({ user: user?.userId, status: { $ne: "Cancelled" } })
        .populate({
          path: "products.product",
          model: ProductModel,
          select: "name price images",
        });
      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const ordersAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await orderModel.find().populate({
        path: "products.product",
        model: ProductModel,
        select: "name price images",
      });

      return res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const updateOrderAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const orderId = req.params.id;
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { paymentStatus: data?.paymentStatus },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order updated", order: updatedOrder });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
export const OrderController = {
  orders,
  ordersAdmin,
  updateOrderAdmin,
};
