import { connectDB } from "@/app/config/db";
import { generateToken } from "@/app/config/jwt";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { fullname, email, password } = await request.json();

    if (!fullname || !email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "يجب ان تكون طول كلمة مرور على الأقل 8" },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json({ error: "البريد غير صالح" }, { status: 400 });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return NextResponse.json(
        { error: "البريد مسجل بالفعل" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 13);

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: isAdmin ? "مسؤول" : "مستخدم",
      bio: "مرحباً بك!"
    });

    const token = generateToken({
      _id: newUser._id,
      role: newUser.role,
    });

    return NextResponse.json({
      success: "تم انشاء الحساب بنجاح",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        bio: newUser.bio,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "حدث خطأ اثناء انشاء حساب" },
      { status: 500 }
    );
  }
}
