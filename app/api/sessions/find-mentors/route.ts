import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { findSuitableMentors } from "@/lib/services/mentor-matching";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Find suitable mentors using AI matching
    const matches = await findSuitableMentors(studentProfile.id);

    // Get available sessions for matched mentors
    const mentorIds = matches.map(match => match.mentor.id);
    const availableSessions = await prisma.sessionSchedule.findMany({
      where: {
        mentorId: { in: mentorIds },
        endDate: { gte: new Date() },
        timeSlots: {
          some: {
            startTime: { gte: new Date() },
            isBooked: false
          }
        }
      },
      include: {
        mentor: true,
        timeSlots: {
          where: {
            startTime: { gte: new Date() },
            isBooked: false
          }
        }
      }
    });

    // Combine matching scores with available sessions
    const recommendedSessions = availableSessions.map(session => {
      const matchData = matches.find(m => m.mentor.id === session.mentorId);
      return {
        session,
        compatibility: matchData?.compatibility || { score: 0, matchReason: "No compatibility data" }
      };
    }).sort((a, b) => b.compatibility.score - a.compatibility.score);

    return NextResponse.json({
      matches: recommendedSessions
    });

  } catch (error) {
    console.error("Error finding suitable mentors:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 