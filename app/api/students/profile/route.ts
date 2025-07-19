import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Look up user in DB to get id and role
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Validate required fields
  const requiredFields = [
    "fullName", "age", "contactNumber", "educationLevel", "school", "subjectsOfInterest", "currentYear", "skillLevels", "learningStyle", "hasDisability"
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }
  // Create StudentProfile
  const profile = await prisma.studentProfile.create({
    data: {
      userId: user.id,
      fullName: data.fullName,
      age: Number(data.age),
      contactNumber: data.contactNumber,
      educationLevel: data.educationLevel,
      school: data.school,
      subjectsOfInterest: Array.isArray(data.subjectsOfInterest) ? data.subjectsOfInterest : String(data.subjectsOfInterest).split(",").map((s: string) => s.trim()),
      currentYear: Number(data.currentYear),
      skillLevels: data.skillLevels,
      learningStyle: data.learningStyle,
      hasDisability: Boolean(data.hasDisability),
      disabilityDesc: data.disabilityDesc || null,
    },
  });
  return NextResponse.json({ profile });
} 