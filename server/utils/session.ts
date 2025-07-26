import type { JWTPayload } from "jose";
import { SignJWT, jwtVerify } from "jose";

type CreateSession = (payload: JWTPayload) => Promise<string>;
type VerifySession = (token: string) => Promise<JWTPayload | null>;

const config = useRuntimeConfig();
const secret = new TextEncoder().encode(config.sessionSecret);

const createSession: CreateSession = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
};

const verifySession: VerifySession = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  }
  catch {
    return null;
  }
};

export { createSession, verifySession };
