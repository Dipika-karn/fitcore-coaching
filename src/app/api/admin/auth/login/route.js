
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/adminSession";

const SESSION_COOKIE = "fitcore_admin_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours

export async function POST(request) {
  try {
    // 1. Read the configured admin credentials and signing secret.
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const authSecret = process.env.AUTH_SECRET;

    if (!adminEmail || !adminPasswordHash || !authSecret) {
      console.error("Admin authentication is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    // 2. Parse the request body.
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    // 3. Validate the body and input types.
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request data." },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // bcrypt only uses up to 72 bytes of password input.
    if (
      email.length > 254 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid login data." },
        { status: 400 }
      );
    }

    // 4. Check the email.
    const normalizedEmail = email.trim().toLowerCase();
    const configuredEmail = adminEmail.trim().toLowerCase();

    if (normalizedEmail !== configuredEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // 5. Validate the stored hash configuration.
    const validBcryptFormat =
      /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(
        adminPasswordHash
      );

    if (!validBcryptFormat) {
      console.error("Configured admin password hash is invalid.");

      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication is misconfigured.",
        },
        { status: 500 }
      );
    }

    // 6. Verify the password against the stored bcrypt hash.
    const passwordMatches = await bcrypt.compare(
      password,
      adminPasswordHash
    );

    if (!passwordMatches) {
      // Invalid credentials must never create a session.
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // 7. Credentials are valid: create a signed session.
    const token = await createAdminSession();

    // 8. Return success and store the token in an HTTP-only cookie.
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
      },
      { status: 200 }
    );

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while processing login.",
      },
      { status: 500 }
    );
  }
}