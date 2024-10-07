import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

export const authVerify =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if Authorization header exists
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json("You Are Not Authorized");
      }
      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json("Token not found");
      }

      // Verify the token
      const verifiedUser = jwt.verify(
        token,
        config.jwt.secret as Secret
      ) as JwtPayload;

      req.user = verifiedUser;
      const { role } = verifiedUser;
      if (roles.length && !roles.includes(role)) {
        return res
          .status(httpStatus.FORBIDDEN)
          .json("You are not authorized to access this route");
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);

      if (error === "TokenExpiredError") {
        return res.status(httpStatus.UNAUTHORIZED).json("Token has expired");
      } else if (error === "JsonWebTokenError") {
        return res.status(httpStatus.UNAUTHORIZED).json("Invalid token");
      } else {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json("An error occurred");
      }
    }
  };
