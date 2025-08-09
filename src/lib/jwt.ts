import { SignJWT, jwtVerify } from 'jose';
import { appConfig } from '@/lib/config';

const encoder = new TextEncoder();
const secretKey = encoder.encode(appConfig.jwtSecret);

export type AuthTokenPayload = {
  sub: string;
  role: 'admin';
};

export async function createAuthToken(payload: AuthTokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, secretKey);
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}
