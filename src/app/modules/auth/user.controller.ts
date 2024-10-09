import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";
import { UserModel } from "./user.model";
import { SortOrder } from "mongoose";
import catchAsync from "../../../shared/catchAsync";
import axios from "axios";
import { google, Auth } from "googleapis";
const createUser = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    // console.log("data:", data);
    const existUser = await UserModel.findOne({ email: data.email });
    // console.log("existUser:", existUser);
    if (existUser) {
      return res.status(400).json({
        status: false,
        message: "Email Already Exist. Email must be unique",
        data: data.email,
      });
    }
    const result = await UserModel.create(data);
    // console.log("result:", result);
    return res.status(201).json({
      success: true,
      statusCode: 200,
      message: "User registered successfully",
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role,
        address: result.address,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    // console.log("get login data:", data);
    const existUser = await UserModel.findOne({ email: data.email }).select(
      "email password role name phone address"
    );

    if (!existUser) {
      return res.status(400).json({
        status: false,
        message: "Email Not Found!",
        data: data.email,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      data.password,
      existUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid password" });
    }
    const jwtToken = jwt.sign(
      { userId: existUser._id, email: existUser.email, role: existUser.role },
      config.jwt.secret as Secret,
      {
        expiresIn: "15 d",
      }
    );

    return res.status(201).json({
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      token: jwtToken,
      data: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        phone: existUser.phone,
        role: existUser.role,
        address: existUser.address,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

const totalUser = async (req: Request, res: Response) => {
  try {
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
        query.role = { $regex: new RegExp(search as string, "i") };
      }

      if (filterField) {
        query.role = { $regex: new RegExp(filterField as string, "i") }; //filterField;
      }

      const count = await UserModel.countDocuments(query);
      const result = await UserModel.find(query)
        .select("-__v -createdAt -updatedAt")
        .sort(options.sort)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit);
      if (result.length < 1) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User data not found",
          data: result.length,
        });
      } else {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Users retrieved successfully",
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
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
const profileUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          status: true,
          message: "un-authorized",
        });
      }
      const result = await UserModel.findById(user?.userId);

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
const googleAuth = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    // console.log("code:", code);
    const oauth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
      config.google_client_id,
      config.google_client_secret,
      "postmessage" // "http://localhost:5173"
    );
    // const data = await oauth2Client.getToken(code);
    const { tokens } = await oauth2Client.getToken(code);
    // console.log("tokens:", tokens);
    oauth2Client.setCredentials(tokens);
    const userResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );
    // console.log("userResponse:", userResponse.data); id, email, name, picture,
    // console.log("userResponse:", userResponse);
    const existUser = await UserModel.findOne({
      email: userResponse?.data?.email,
    });
    // console.log("existUser:", existUser);
    if (!existUser) {
      const data = {
        name: userResponse?.data.name,
        email: userResponse?.data.email,
        image: userResponse?.data.picture,
        password: "",
        phone: "",
        address: "",
      };
      await UserModel.create(data);
      // console.log("result:", result);  const result =
    }
    const findUser = await UserModel.findOne({
      email: userResponse?.data.email,
    }).select("email role name phone address");
    if (!findUser) {
      return;
    }
    const jwtToken = jwt.sign(
      {
        userId: findUser._id,
        email: findUser.email,
        role: findUser.role,
      },
      config.jwt.secret as Secret,
      {
        expiresIn: "15 d",
      }
    );

    // console.log("data:", { data: userResponse.data, token: jwtToken });
    return res.status(201).json({
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      // token: jwtToken,
      data: {
        accessToken: jwtToken,
        user: {
          _id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          phone: findUser?.phone,
          role: findUser?.role,
          address: findUser?.address,
        },
      },
    });
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).json({ error: "Failed to exchange authorization code" });
  }
};
export const UserController = {
  createUser,
  loginUser,
  totalUser,
  profileUser,
  googleAuth,
};
