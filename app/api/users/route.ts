import { connectDB } from "@/app/config/db";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
connectDB();
export const GET = async (request: NextRequest) => {
  try {
    const user = await isAuthenticate(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصر بك" });
    }
    const users = await User.find().sort({ createdAt: -1 });
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "لا يوجد مستخدمين بعد" });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء جلب مستخدمين" });
  }
};


export async function PUT(request: NextRequest) {
  try {
    const { oldPassword, newPassword } = await request.json();

    const user = await isAuthenticate(request);

    if (user.role !== "مسؤول") {
      return NextResponse.json({ error: "ليس لديك صلاحية تغيير كلمة المرور" }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return NextResponse.json({ error: "كلمة المرور القديمة غير صحيحة" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 13);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
