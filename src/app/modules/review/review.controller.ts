import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewModel } from "./review.model";
import { ProductModel } from "../products/product.model";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const data = req.body;
      const result = await ReviewModel.create({
        ...data,
        user: user?.userId,
      });
      // Update the product with the review ID
      await ProductModel.findByIdAndUpdate(data.product, {
        $push: { review: result?._id },
      });
      return res.status(200).json({
        status: true,
        message: "Review created successfully!",
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
const reviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req reviews");
    try {
      const result = await ReviewModel.find()
        .populate({
          path: "product",
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
export const ReviewController = {
  createReview,
  reviews,
};

// const result = await ProductModel.create(data);
// const bookingData = await BookingModel.findById(result._id)
//   .lean()
//   .select("-__v -createdAt -updatedAt");
