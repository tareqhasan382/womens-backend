import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import orderModel from "./order.model";
import { ProductModel } from "../products/product.model";
import { SortOrder } from "mongoose";
const orders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      // console.log("orders user:", user);
      const result = await orderModel
        .find({ user: user?.userId, status: { $ne: "Cancelled" } })
        .populate({
          path: "products.product",
          model: ProductModel,
          select: "name price images",
        });
      // console.log("result:", result);
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
    // console.log("request order Admin");
    try {
      const { page, limit, search, filterField, sortOrder, sortField } =
        req.query;

      const options = {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,

        sort: sortOrder
          ? { [sortField as string]: parseInt(sortOrder as string) }
          : {},
      } as {
        page: number;
        limit: number;

        sort: { [key: string]: SortOrder };
      };

      const query: any = {};

      if (search) {
        query.category = { $regex: new RegExp(search as string, "i") };
      }

      if (filterField) {
        query.category = { $regex: new RegExp(filterField as string, "i") }; //filterField;
      }

      const result = await orderModel
        .find(query)
        .populate({
          path: "products.product",
          model: ProductModel,
          select: "name price images",
        })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort({ createdAt: -1 });
      // console.log("admin Orders:", result);
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
