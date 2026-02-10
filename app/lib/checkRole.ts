import { db } from "./db";
import User from "../models/users";

export async function GetRole(userId: string) {
  try {
    await db();
    const user = await User.findById(userId);
    if (!user) {
      return { error: "Couldn't find the user", success: false };
    }
    if (user.role !== "admin") {
      console.log("Unauthorized acces");
      return { error: "Unauthorized acces", success: false };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
