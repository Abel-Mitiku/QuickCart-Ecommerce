import User from "../models/users";
import { db } from "./db";

export async function getAllUsers() {
  try {
    await db();
    const users = await User.find();
    return { users, success: true };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
