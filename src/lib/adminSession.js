
import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = 8 * 60 * 60; // 8 hours
const SESSION_ISSUER = "fitcore-coaching";
const SESSION_AUDIENCE = "fitcore-admin";

// Convert AUTH_SECRET into the byte format jose expects.
function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  // This project generates AUTH_SECRET as a random hex string.
  if (!/^[a-f0-9]{64}$/i.test(secret)) {
    throw new Error(
      "AUTH_SECRET must be a 64-character hexadecimal string."
    );
  }

  return new TextEncoder().encode(secret);
}

// Create a signed, time-limited admin session.
export async function createAdminSession() {
  const secret = getSessionSecret();

  const token = await new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);

  return token;
}

// Verify the signature, issuer, audience, and expiration.
export async function verifyAdminSession(token) {
  const secret = getSessionSecret();

  const { payload } = await jwtVerify(token, secret, {
    issuer: SESSION_ISSUER,
    audience: SESSION_AUDIENCE,
    algorithms: ["HS256"],
  });

  // Ensure this token represents our admin session.
  if (payload.sub !== "admin" || payload.role !== "admin") {
    throw new Error("Invalid admin session.");
  }

  return payload;
}