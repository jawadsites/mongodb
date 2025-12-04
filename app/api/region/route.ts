import { connectDB } from "@/app/config/db";
import { isAdmin } from "@/app/middlewares/isAdmin";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";
import Region from "@/app/models/Region";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export const GET = async (request: NextRequest) => {
  try {
    const user = await isAuthenticate(request);

    if(!user){
        return NextResponse.json({error:   "غير مصرح بك"})
    }

    const regions = await Region.find().sort({ createdAt: -1 }).populate("supervisor");
    if (!regions || regions.length === 0) {
      return NextResponse.json({ error: "لا يوجد مناطق حتى الأن" });
    }

    return NextResponse.json(regions);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء عرض مناطق" });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const adminCheck = await isAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }
    const { regionName, governorateName , supervisor} = await request.json();

    if (!regionName || !governorateName || !supervisor) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" });
    }

     

    const region = await Region.create({
      regionName,
      governorateName,
      supervisor
    });

     await User.findByIdAndUpdate(supervisor, { role: "مشرف" });

    return NextResponse.json(region);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء انشاء منطقة" });
  }
};
