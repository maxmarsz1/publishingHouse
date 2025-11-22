import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_VERIFICATION_KEY;

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get('cookie') || '';
    console.log(req.headers.get('cookie'))
    const cookieMap = Object.fromEntries(
      cookies.split('; ').map((c) => c.split('='))
    );

    const accessToken = cookieMap['accessToken'];
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const decoded = jwt.decode(accessToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 400 });
    }

    const isStaff = typeof decoded === 'object' && decoded !== null && 'is_staff' in decoded ? decoded.is_staff : false;

    return NextResponse.json({ isStaff });
  } catch (error) {
    console.error('Error decoding access token:', error);
    return NextResponse.json({ error: 'Failed to decode token' }, { status: 500 });
  }
}