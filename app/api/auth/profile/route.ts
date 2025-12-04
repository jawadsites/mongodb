import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/config/db";
import cloudinary from "@/app/config/cloudinary";
import streamifier from "streamifier";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // التحقق من المصادقة
    let user;
    try {
      user = await isAuthenticate(req);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }

    const formData = await req.formData();
    const avatarFile = formData.get("avatar") as File | null;

    if (!avatarFile || avatarFile.size === 0) {
      return NextResponse.json({ error: "لم يتم رفع أي ملف" }, { status: 400 });
    }

    const extractPublicId = (url: string) => {
      const parts = url.split("/");
      const file = parts.pop()!;
      return file.split(".")[0];
    };

    const uploadToCloudinary = async (file: File, folder: string) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ folder }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        file.arrayBuffer().then(buffer => {
          streamifier.createReadStream(Buffer.from(buffer)).pipe(stream);
        }).catch(reject);
      });
    };

    // حذف الصورة القديمة إذا موجودة
    if (user.avatar && user.avatar.includes("res.cloudinary.com")) {
      const oldId = extractPublicId(user.avatar);
      await cloudinary.v2.uploader.destroy(`users/avatars/${oldId}`);
    }

    // رفع الصورة الجديدة
    const avatarUpload = await uploadToCloudinary(avatarFile, "users/avatars");

    // تحديث المستخدم في قاعدة البيانات
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: avatarUpload.secure_url },
      { new: true }
    );

    return NextResponse.json({ success: "تم تعديل الصورة الشخصية بنجاح", user: updatedUser });
  } catch (error: any) {
    console.error("PATCH /profile error:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ أثناء تعديل الصورة الشخصية" },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = await isAuthenticate(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بك" }, { status: 401 });
    }

    const body = await request.json();
    const { bio } = body;

    if (!bio || typeof bio !== "string") {
      return NextResponse.json({ error: "النبذة غير صالحة" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      {_id: user._id},
      { bio },
      { new: true } 
    );

    return NextResponse.json({ success: "تم تحديث النبذة بنجاح", user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل النبذة" },
      { status: 500 }
    );
  }
}