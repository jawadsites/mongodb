import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import RegionInfo from "@/app/models/RegionInfo";
import Region from "@/app/models/Region";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";
import { isAdmin } from "@/app/middlewares/isAdmin";
import { connectDB } from "@/app/config/db";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    
    const user = await isAuthenticate(request);
    if (!user)
      return NextResponse.json({ error: "غير مصرح بك" }, { status: 401 });

    const regionId = params.id;
    if (!regionId || !mongoose.Types.ObjectId.isValid(regionId)) {
      return NextResponse.json(
        { error: "معرف المنطقة غير صالح" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const requiredFields = [
      "patientInfo",
      "idNumber",
      "age",
      "unit",
      "brigade",
      "commander",
      "mission",
      "injuries",
      "injuryDate",
      "doctorName",
      "residence",
      "supervisor",
      "hospital",
      "InitialDiagnosis",
      "DoctorRecommendations",
    ];
    

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `الحقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    const region = await Region.findById(regionId);
    if (!region)
      return NextResponse.json(
        { error: "المنطقة غير موجودة" },
        { status: 404 }
      );

    const regionInfo = await RegionInfo.create({
      ...data,
      region: region._id,
      userId: user._id,
    });

    return NextResponse.json(regionInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء السجل" },
      { status: 500 }
    );
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    
    const user = await isAuthenticate(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بك" }, { status: 401 });
    }
    const regionId = params.id;
    if (!regionId || !mongoose.Types.ObjectId.isValid(regionId)) {
      return NextResponse.json(
        { error: "معرف المنطقة غير صالح" },
        { status: 400 }
      );
    }

    // Get records only for this specific region
    const records = await RegionInfo.find({ region: regionId }).sort({
      createdAt: -1,
    });
    
    return NextResponse.json({ records });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب السجلات" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const regionInfoId = params.id;
    if (!regionInfoId || !mongoose.Types.ObjectId.isValid(regionInfoId)) {
      return NextResponse.json(
        { error: "معرف السجل غير صالح" },
        { status: 400 }
      );
    }

    const data = await request.json();

     const requiredFields = [
      "patientInfo",
      "idNumber",
      "age",
      "unit",
      "brigade",
      "commander",
      "mission",
      "injuries",
      "injuryDate",
      "doctorName",
      "residence",
      "supervisor",
      "hospital",
      "InitialDiagnosis",
      "DoctorRecommendations",
    ];
    

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `الحقل ${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    const updated = await RegionInfo.findOneAndUpdate(
      { _id: regionInfoId },
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث السجل" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const regionInfoId = params.id;
    if (!regionInfoId || !mongoose.Types.ObjectId.isValid(regionInfoId)) {
      return NextResponse.json(
        { error: "معرف السجل غير صالح" },
        { status: 400 }
      );
    }

    const deleted = await RegionInfo.findOneAndDelete({ _id: regionInfoId });

    if (!deleted) {
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف السجل بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف السجل" },
      { status: 500 }
    );
  }
};
