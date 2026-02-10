import { db } from "../db";
import User from "@/app/models/users";

export async function FetchUserInfo(userId: string) {
  try {
    await db();
    const user = await User.findOne({ _id: userId })
      .select(
        "_id firstName lastName email phone streetAddress city state zipCode country",
      )
      .lean();
    if (!user) {
      return { error: "Unexpected error happened", success: false };
    }
    let userInfo: any[] = [];
    userInfo.push({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
    });
    return { userInfo, success: true };
  } catch (err: any) {
    console.log(err.message);
    return { error: err.message, success: false };
  }
}
