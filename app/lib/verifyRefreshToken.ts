import Jwt from "jsonwebtoken";

type verifyResult =
  | { success: true; userId: string }
  | { success: false; error: string };
export function verifyRefreshToken(token: string, key: string): verifyResult {
  try {
    const decoded = Jwt.verify(token, key) as { userId: string };
    return { success: true, userId: decoded.userId };
  } catch (err: any) {
    console.log(err.message);
    return { success: false, error: err.message };
  }
}
