import { connectDB } from "@/app/config/db";
import { generateToken } from "@/app/config/jwt";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "البريد الألكتروني غير مسجل" },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "كلمة مرور خاطئة" }, { status: 400 });
    }

    const token = generateToken({
      _id: user._id,
      role: user.role,
    });
    return NextResponse.json({
      success: "تم تسجيل دخول ب نجاح",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "حدث خطأ اثناء تسجيل دخول" },
      { status: 500 }
    );
  }
}
