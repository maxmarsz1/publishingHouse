import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const refresh = (await cookies()).get("refresh")?.value;
    console.log("Refresh token: ",refresh)
  if (!refresh) {
    return NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    );
  }

  // Call Django refresh endpoint
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  const access = data.access;

  const response = await fetch(`${process.env.API_BASE_URL}/api/auth/store`, {
    method: "POST",
    body: JSON.stringify({ access, refresh }),
    headers: { "Content-Type": "application/json" },
  });

  return NextResponse.json({ success: true });
}
