import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { InitService } from "./payment.service";
import orderModel from "../order/order.model";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const payload = req.body;
      const result = await InitService.initPayment(payload);
      await orderModel.create({ ...payload, user: user?.userId });
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

export const PaymentController = {
  createPayment,
};
