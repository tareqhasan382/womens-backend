import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { InitService } from "./payment.service";
import orderModel from "../order/order.model";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const payload = req.body;
      const result = await InitService.initPayment({
        ...payload,
        user: user?.userId,
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
const paymentSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (data.status !== "VALID") {
        return res.status(404).json({
          status: false,
          message: "Invalid payment",
        });
      }
      const result = await orderModel.findOneAndUpdate(
        { transactionId: data.tran_id },
        {
          $set: {
            status: "Paid",
            paymentStatus: "Paid",
            bank_tran_id: data.bank_tran_id,
          },
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      return res.redirect("http://localhost:3000/payment-success");
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const paymentFail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const result = await orderModel.findOneAndUpdate(
        { transactionId: data.tran_id },
        {
          $set: {
            paymentStatus: "Failed",
            bank_tran_id: data.bank_tran_id,
          },
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      return res.redirect("http://localhost:3000/payment-fail");
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const paymentCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (data.status !== "CANCELLED") {
        return res.status(404).json({
          status: false,
          message: "Cancelled payment",
        });
      }
      const result = await orderModel.findOneAndUpdate(
        { transactionId: data.tran_id },
        {
          $set: {
            status: "Cancelled",
          },
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Order not found",
        });
      }

      return res.redirect("http://localhost:3000/payment-cancel");
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
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
