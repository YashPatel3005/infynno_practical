import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import constants from "../../config/constants";
import config from "config";
import User from "../models/user.model";

const secretKey = config.get<string>("jwt_secret");

interface IJwtPayload {
  userId: string;
}

export interface IRequest extends Request {
  user?: object;
  token?: string;
}

export const authenticateToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.header("Authorization")) {
      return res.status(401).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Unauthorized, please login.",
        error: true,
        data: {},
      });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Unauthorized, please login.",
        error: true,
        data: {},
      });
    }

    const decoded = jwt.verify(token, secretKey) as IJwtPayload;

    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token,
    });

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Forbidden - Token expired, please login.",
        error: true,
        data: {},
      });
    }

    res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};
