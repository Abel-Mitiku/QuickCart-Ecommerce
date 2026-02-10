import { NextResponse } from "next/server";
import User from "@/app/models/users";
import { db } from "@/app/lib/db";
import Jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  try {
    await db();
    const { token } = await req.json();
    console.log(token);
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ error: "User not found", success: false });
    }
    const verificationToken = Jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" },
    );
    user.verificationToken = verificationToken;
    const save = await user.save();
    const send = await sendVerificationEmail(user.email, verificationToken);
    if (save && send) {
      return NextResponse.json({ message: send.message, success: false });
    }
    return NextResponse.json({ error: "Error occured", success: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false });
  }
}
