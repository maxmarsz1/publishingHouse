import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value ?? null;
}

const JWT_SECRET = process.env.JWT_VERIFICATION_KEY as string; 

interface TokenPayload {
  user_id: number;
  username: string;
  is_staff: boolean; 
  exp: number; 
}

export async function getSecureUserClaims(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken || !JWT_SECRET) {
        return null;
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET, {
            algorithms: ['HS256'] 
        }) as object;

        const payload = decoded as TokenPayload;
        
        if (typeof payload.is_staff !== 'boolean' || !payload.username || !payload.user_id) {
            console.error("JWT payload is missing expected claims.");
            return null;
        }

        return payload;

    } catch (e) {
        console.error("JWT verification failed:", e);
        cookieStore.delete('accessToken');
        return null;
    }
}

export async function isUserStaff(): Promise<Boolean>{
    const claims =  await getSecureUserClaims();
    return claims ? claims.is_staff : false;
}