import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g., http://localhost:8000/api

export async function POST(req: Request) {
  try {
    // 1️⃣ Read cookies from the incoming request
    const cookieHeader = req.headers.get('cookie') || '';
    const cookiesObj = Object.fromEntries(
      cookieHeader.split('; ').map(c => c.split('='))
    );
    const refreshToken = cookiesObj['refreshToken'];

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 400 });
    }

    // 2️⃣ Forward refresh request to Django
    const djangoResponse = await axios.post(
      `${API_BASE_URL}/auth/refresh/`,
      { refresh: refreshToken }, // Django expects { "refresh": "..." }
      {
        headers: { cookie: cookieHeader }, // forward cookies if needed
        withCredentials: true,
      }
    );

    // 3️⃣ Create NextResponse and forward Django data
    const res = NextResponse.json(djangoResponse.data);

    // 4️⃣ Forward Set-Cookie headers from Django
    const setCookie = djangoResponse.headers['set-cookie'];
    if (setCookie) {
      if (Array.isArray(setCookie)) {
        setCookie.forEach((c) => res.headers.append('Set-Cookie', c));
      } else {
        res.headers.append('Set-Cookie', setCookie);
      }
    }

    return res;
  } catch (err: any) {
    console.error('Proxy refresh failed:', err.response?.data || err);
    return NextResponse.json(
      { error: 'Refresh failed' },
      { status: err.response?.status || 500 }
    );
  }
}
