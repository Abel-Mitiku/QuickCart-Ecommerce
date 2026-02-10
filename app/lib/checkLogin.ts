import User from "../models/users";
import { cookies } from "next/headers";
import { verifyJWT } from "./verifyJWT";
import { use } from "react";

export async function checkLogin() {
  const cookieStore = await cookies();
  console.log("Checking started");
  const token = cookieStore.get("access-token")?.value.toString();
  if (!token) {
    console.log("no tokens");
    return false;
  }
  const user = await verifyJWT(token, process.env.JWT_SECRET!);

  if (user.success) {
    return true;
  }

  return false;
}
