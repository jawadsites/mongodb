import type { Types } from "mongoose";
import jsonwebtoken from "jsonwebtoken";

interface TokenPayload {
  _id: Types.ObjectId | string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string | any;

export const generateToken = (payload: TokenPayload) => {
  const token = jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyToken = (token: string) : TokenPayload | null => {
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};


