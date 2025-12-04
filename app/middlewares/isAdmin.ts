import User from "@/app/models/User";
import { NextRequest } from "next/server";
import { isAuthenticate } from "./isAuthenticate";

export async function isAdmin(request: NextRequest) {
  try {
    const authUser = await isAuthenticate(request);

    if (!authUser) {
      return { error: "غير مصرح بك", status: 401 };
    }

    const user = await User.findById(authUser._id);

    if (!user || user.role !== "مسؤول") {
      return { error: "ممنوع: المسؤولين فقط", status: 403 };
    }

    return { user };
  } catch (error) {
    console.log("isAdmin Error:", error);
    return { error: "حدث خطأ أثناء التحقق من الصلاحيات", status: 500 };
  }
}
