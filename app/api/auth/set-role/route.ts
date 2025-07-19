import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { role } = await req.json();
  if (role !== "MENTOR" && role !== "STUDENT") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  await prisma.user.update({
    where: { email: session.user.email },
    data: { role },
  });
  return NextResponse.json({ success: true });
} 