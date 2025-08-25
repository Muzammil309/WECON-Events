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

export async function verifyAuthTokenFromRequest(request: Request): Promise<{ valid: boolean; payload?: AuthTokenPayload }> {
  try {
    let token: string | undefined;

    // First try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // If no Bearer token, try to get from cookies (for admin dashboard)
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        token = cookies['wecon_admin_token'];
      }
    }

    if (!token) {
      return { valid: false };
    }

    const payload = await verifyAuthToken(token);

    if (!payload) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
