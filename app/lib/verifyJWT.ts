import Jwt from "jsonwebtoken";
import { requestRefreshToken } from "./refreshToken";

export async function verifyJWT(token: string, key: string) {
  try {
    const decoded = Jwt.verify(token, key) as { userId: string };
    console.log("JWT verifying");
    return { success: true, userId: decoded.userId };
  } catch (err: any) {
    console.log(err.message);
    if (err.name === "TokenExpiredError") {
      const refresh = await requestRefreshToken();
      if (refresh?.success) {
        return {
          message: "token refreshed",
          success: true,
          userId: refresh.userId,
        };
      }
      return { error: refresh?.error, success: false };
    }
    return { success: false, error: err.message };
  }
}
