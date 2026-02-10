import { NextResponse } from "next/server";
import { GetRole } from "@/app/lib/checkRole";
import { cookies } from "next/headers";
import { verifyJWT } from "@/app/lib/verifyJWT";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access-token")?.value.toString();
    if (!token) {
      return NextResponse.json({ error: "Not logged in", success: false });
    }
    const decoded = (await verifyJWT(token, process.env.JWT_SECRET!)) as {
      userId: string;
    };
    const result = await GetRole(decoded?.userId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message, success: false });
  }
}
