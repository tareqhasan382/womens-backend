import { NextFunction, Request, Response } from "express";
import { ProductModel } from "./product.model";
import catchAsync from "../../../shared/catchAsync";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const data = req.body;
      const result = await ProductModel.create({
        ...data,
        user: user?.userId,
      });
      return res.status(200).json({
        status: true,
        message: "Booking created successfully!",
        date: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const products = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductModel.find()
        .populate({
          path: "review",
          select: "-__v -createdAt -updatedAt",
        })
        .select("-__v -createdAt -updatedAt");
      if (result.length < 1) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Product data not found",
          data: result.length,
        });
      } else {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Products retrieved successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
export const ProductController = {
  createProduct,
  products,
};

// const result = await ProductModel.create(data);
// const bookingData = await BookingModel.findById(result._id)
//   .lean()
//   .select("-__v -createdAt -updatedAt");
