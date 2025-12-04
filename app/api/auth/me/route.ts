import { NextRequest, NextResponse } from "next/server";
import { isAuthenticate } from "@/app/middlewares/isAuthenticate";

export const GET = async (request: NextRequest) => {
  try {
    const user = await isAuthenticate(request);

    const  userData  = user.toObject(); 
    return NextResponse.json({ success: true, user: userData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
