import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const correctPassword = "1"; // Replace with a secure password or fetch from an env variable.

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false });
  }
}
