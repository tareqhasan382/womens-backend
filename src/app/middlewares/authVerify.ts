import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

export const authVerify =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json("You Are Not Authorized");
      }

      //2 verify token
      let vefifiedUser = null;
      vefifiedUser = jwt.verify(
        token,
        config.jwt.secret as Secret
      ) as JwtPayload;
      req.user = vefifiedUser; // role , userId
      // console.log("vefifiedUser:", vefifiedUser);
      const { role }: any = vefifiedUser;
      // role authorise
      if (roles.length && !roles.includes(role)) {
        return res
          .status(401)
          .json("You are not authorized to access this route");
        //  throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
      }
      next();
    } catch (error) {
      next(error);
    }
  };
