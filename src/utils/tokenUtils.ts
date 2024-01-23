import jwt from "jsonwebtoken";
import config from "config";
import { TokenPayload } from "../interfaces/UserInterface";

const secretKey = config.get<string>("jwtSecret");
const tokenExpiration = config.get<string>("tokenExpiration");

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};
