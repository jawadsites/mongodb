import { connectDB } from "@/app/config/db";
import { isAdmin } from "@/app/middlewares/isAdmin";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";

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

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "المعرف مستخدم مطلوب" }, { status: 400 });
    }

    const userById = await User.findById(id);
    if (!userById) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json(userById);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "حدث خطأ اثناء جلب مستخدم" }, { status: 500 });
  }
};


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const adminCheck = await isAdmin(request);

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "المعرف مطلوب" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: "تم حذف المستخدم بنجاح" },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المستخدم" },
      { status: 500 }
    );
  }
}
