import jwt from "jsonwebtoken";
import config from "config";

const secretKey = config.get<string>("jwt_secret");

export interface TokenPayload {
  userId: string;
  username: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};
