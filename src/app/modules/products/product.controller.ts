import { NextFunction, Request, Response } from "express";
import { ProductModel } from "./product.model";
import catchAsync from "../../../shared/catchAsync";
import { SortOrder } from "mongoose";

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
      const { page, limit, search, filterField, sortOrder, sortField } =
        req.query;

      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),

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

      const count = await ProductModel.countDocuments(query);
      const result = await ProductModel.find(query)
        .select("-__v -createdAt -updatedAt")
        .sort(options.sort)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
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
          meta: {
            total: count,
            page: options.page,
            limit: options.limit,
          },
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
const flatSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductModel.find({ discountedPrice: 50 }).select(
        "-__v -createdAt -updatedAt"
      );

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
const product = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await ProductModel.findById({ _id: id });
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Product retrieved successfully",
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
const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await ProductModel.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Deleted Product successfully",
        data: id,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  }
);
const totalProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await ProductModel.countDocuments();

      if (count < 1) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "products data not found",
          total: count,
        });
      } else {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "products retrieved successfully",
          data: count,
        });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }
  }
);
export const ProductController = {
  createProduct,
  products,
  product,
  deleteProduct,
  flatSale,
  totalProducts,
};

// const result = await ProductModel.create(data);
// const bookingData = await BookingModel.findById(result._id)
//   .lean()
//   .select("-__v -createdAt -updatedAt");
