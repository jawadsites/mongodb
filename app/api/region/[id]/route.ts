import { connectDB } from "@/app/config/db";
import { isAdmin } from "@/app/middlewares/isAdmin";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";
import Region from "@/app/models/Region";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const user = await isAuthenticate(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بك" });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "معرف  منطقة مطلوب" });
    }

    const region = await Region.findById(id);
    if (!region) {
      return NextResponse.json({ error: "المنطقة غير موجودة" });
    }
    return NextResponse.json(region);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء جلب منطقة" });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const adminCheck = await isAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "معرف  منطقة مطلوب" });
    }
    const { regionName, governorateName, supervisor } = await request.json();

if (!regionName || !governorateName || !supervisor) {
  return NextResponse.json({ error: "جميع الحقول مطلوبة" });
}

const region = await Region.findOneAndUpdate(
  { _id: id },
  { regionName, governorateName, supervisor },
  { new: true }
);

    if (!region) {
      return NextResponse.json({ error: "منطقة غير موجودة" });
    }

         await User.findByIdAndUpdate(supervisor, { role: "مشرف" });

    return NextResponse.json(region);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء تعديل منطقة" });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const adminCheck = await isAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "معرف  منطقة مطلوب" });
    }

    const region = await Region.findOneAndDelete({ _id: id }, { new: true });

    if (!region) {
      return NextResponse.json({ error: "منطقة غير موجودة" });
    }
    return NextResponse.json(region);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء حذف منطقة" });
  }
};
