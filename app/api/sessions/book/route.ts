import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generateMeetLink } from "@/lib/utils/google-meet";

// Validation schema for booking a session
const bookingSchema = z.object({
  timeSlotId: z.string(),
  paymentMethod: z.enum(["BANK_TRANSFER", "ONLINE_PAYMENT"]),
  bankSlipImage: z.string().optional(), // URL of uploaded bank slip
});

export async function POST(request: Request) {
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

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Check if time slot exists and is available
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: validatedData.timeSlotId },
      include: { sessionSchedule: true }
    });

    if (!timeSlot) {
      return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
    }

    if (timeSlot.isBooked) {
      return NextResponse.json({ error: "Time slot is already booked" }, { status: 400 });
    }

    // Start a transaction to book the session
    const booking = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          amount: timeSlot.sessionSchedule.price,
          status: validatedData.paymentMethod === "BANK_TRANSFER" ? "PENDING" : "COMPLETED",
          paymentMethod: validatedData.paymentMethod,
          bankSlipImage: validatedData.bankSlipImage,
        }
      });

      // Generate Google Meet link
      const meetingLink = await generateMeetLink(timeSlot.startTime, timeSlot.endTime, timeSlot.sessionSchedule.title);

      // Create booking
      const booking = await tx.sessionBooking.create({
        data: {
          timeSlotId: timeSlot.id,
          studentId: studentProfile.id,
          status: validatedData.paymentMethod === "BANK_TRANSFER" ? "PENDING" : "CONFIRMED",
          meetingLink,
          paymentId: payment.id,
          paymentStatus: payment.status,
        }
      });

      // Mark time slot as booked
      await tx.timeSlot.update({
        where: { id: timeSlot.id },
        data: { isBooked: true }
      });

      return booking;
    });

    return NextResponse.json({
      message: "Session booked successfully",
      booking
    }, { status: 201 });

  } catch (error) {
    console.error("Error booking session:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get student's bookings
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const bookings = await prisma.sessionBooking.findMany({
      where: { studentId: studentProfile.id },
      include: {
        timeSlot: {
          include: {
            sessionSchedule: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bookings);

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 