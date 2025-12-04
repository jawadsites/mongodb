import { NextRequest } from "next/server";
import { verifyToken } from "../config/jwt";
import User from "../models/User";


export const isAuthenticate = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("غير مصرح بك");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token as string);

  if (!decoded || !decoded._id) {
    throw new Error("فشل في المصادقة");
  }

  const user = await User.findById(decoded._id)
  if (!user) throw new Error("المستخدم غير موجود");

  return user;
  } catch (error) {
    console.log(error);
  }
};
