import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, pending, upcoming, completed
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : new Date();
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    // Get all session schedules for the mentor
    const schedules = await prisma.sessionSchedule.findMany({
      where: {
        mentorId: mentorProfile.id,
        startDate: { gte: startDate },
        ...(endDate && { endDate: { lte: endDate } }),
      },
      include: {
        timeSlots: {
          include: {
            booking: {
              include: {
                student: true,
                payment: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    // Get pending payment approvals
    const pendingPayments = await prisma.sessionBooking.findMany({
      where: {
        timeSlot: {
          sessionSchedule: {
            mentorId: mentorProfile.id
          }
        },
        status: "PENDING_PAYMENT",
        payment: {
          paymentMethod: "BANK_TRANSFER",
          status: "PENDING"
        }
      },
      include: {
        timeSlot: {
          include: {
            sessionSchedule: true
          }
        },
        student: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process and categorize the data
    const processedSchedules = schedules.map(schedule => {
      const bookings = schedule.timeSlots
        .filter(slot => slot.booking)
        .map(slot => slot.booking!);

      const stats = {
        totalSlots: schedule.timeSlots.length,
        bookedSlots: bookings.length,
        availableSlots: schedule.timeSlots.filter(slot => !slot.isBooked).length,
        pendingApproval: bookings.filter(b => b.status === "PENDING_MENTOR_APPROVAL").length,
        confirmed: bookings.filter(b => b.status === "APPROVED").length,
      };

      return {
        ...schedule,
        stats,
        upcomingSessions: schedule.timeSlots
          .filter(slot => slot.booking && slot.startTime > new Date())
          .map(slot => ({
            timeSlot: slot,
            booking: slot.booking,
          }))
          .sort((a, b) => a.timeSlot.startTime.getTime() - b.timeSlot.startTime.getTime())
      };
    });

    // Filter schedules based on the request
    let filteredSchedules = processedSchedules;
    if (filter === "pending") {
      filteredSchedules = processedSchedules.filter(s => s.stats.pendingApproval > 0);
    } else if (filter === "upcoming") {
      filteredSchedules = processedSchedules.filter(s => s.upcomingSessions.length > 0);
    } else if (filter === "completed") {
      filteredSchedules = processedSchedules.filter(s => s.endDate < new Date());
    }

    return NextResponse.json({
      schedules: filteredSchedules,
      pendingPayments,
      summary: {
        totalSchedules: schedules.length,
        totalBookings: schedules.reduce((acc, s) => 
          acc + s.timeSlots.filter(t => t.booking).length, 0),
        pendingApprovals: pendingPayments.length,
        upcomingSessionsCount: schedules.reduce((acc, s) => 
          acc + s.timeSlots.filter(t => t.booking && t.startTime > new Date()).length, 0)
      }
    });

  } catch (error) {
    console.error("Error fetching mentor dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 