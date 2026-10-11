
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/adminSession";

const SESSION_COOKIE_NAME = "fitcore_admin_session";

export async function getAdminSession() {
  try {
    // 1. Read cookies from the incoming server request.
    const cookieStore = await cookies();

    // 2. Retrieve the admin session token.
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // 3. No token means the request is unauthenticated.
    if (!token) {
      return null;
    }

    // 4. Verify the JWT signature, expiry, issuer,
    //    audience, subject, and admin role.
    const session = await verifyAdminSession(token);

    // 5. Return verified claims only.
    return session;
  } catch {
    // Missing, malformed, expired, tampered tokens,
    // or verification failures must not authenticate.
    return null;
  }
}