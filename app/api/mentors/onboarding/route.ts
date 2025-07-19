import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Look up user in DB to get id and role
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    // Validate required fields
    const requiredFields = [
      "fullName", "age", "contactNumber", "preferredLanguage", "currentLocation", "shortBio", "professionalRole", "subjectsToTeach", "experienceYears", "preferredStudentLevels", "linkedIn"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    // Create MentorProfile
    const mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        age: Number(data.age),
        contactNumber: data.contactNumber,
        preferredLanguage: data.preferredLanguage,
        currentLocation: data.currentLocation,
        shortBio: data.shortBio,
        professionalRole: data.professionalRole,
        subjectsToTeach: Array.isArray(data.subjectsToTeach) ? data.subjectsToTeach : String(data.subjectsToTeach).split(",").map((s: string) => s.trim()),
        experienceYears: data.experienceYears,
        preferredStudentLevels: Array.isArray(data.preferredStudentLevels) ? data.preferredStudentLevels : String(data.preferredStudentLevels).split(",").map((s: string) => s.trim()),
        linkedIn: data.linkedIn,
        githubPortfolio: data.githubPortfolio || null,
        profilePicture: data.profilePicture || null,
      },
    });
    return NextResponse.json({ success: true, mentorProfile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 