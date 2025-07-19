import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // You may want to validate data here

    // Create MentorProfile (assumes user already exists and userId is provided)
    const mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: data.userId,
        professionalBackground: {
          currentPosition: data.professionalRole,
        },
        socialLinks: {
          linkedIn: data.linkedIn,
          github: data.github,
          portfolio: data.portfolio,
        },
        profilePictureUrl: data.profilePictureUrl,
        // Add other fields as needed
        // ...
      },
    });

    return NextResponse.json({ success: true, mentorProfile });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 