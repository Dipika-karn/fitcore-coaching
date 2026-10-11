
import { NextResponse } from "next/server";

const SESSION_COOKIE = "fitcore_admin_session";

export async function POST() {
  try {
    // Return a response that expires the existing session cookie.
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully.",
      },
      { status: 200 }
    );

    // Use the same cookie name and path as the login API.
    // maxAge: 0 tells the browser to delete the cookie.
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out. Please try again.",
      },
      { status: 500 }
    );
  }
}