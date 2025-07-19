import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { generateMeetLink } from "@/lib/utils/google-meet";

// Validation schema for mentor approval
const approvalSchema = z.object({
  bookingId: z.string(),
  action: z.enum(["APPROVE", "REJECT"]),
  notes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export async function POST(request: Request) {
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

    const body = await request.json();
    const validatedData = approvalSchema.parse(body);

    // Get booking details
    const booking = await prisma.sessionBooking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        timeSlot: {
          include: {
            sessionSchedule: true
          }
        },
        payment: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify mentor owns this session
    if (booking.timeSlot.sessionSchedule.mentorId !== mentorProfile.id) {
      return NextResponse.json({ error: "Not authorized to approve this booking" }, { status: 403 });
    }

    // Verify payment status
    if (booking.paymentStatus !== "VERIFIED") {
      return NextResponse.json({ error: "Payment not yet verified" }, { status: 400 });
    }

    if (validatedData.action === "APPROVE") {
      // Generate Google Meet link
      const meetingLink = await generateMeetLink(
        booking.timeSlot.startTime,
        booking.timeSlot.endTime,
        booking.timeSlot.sessionSchedule.title
      );

      // Update booking status
      const updatedBooking = await prisma.sessionBooking.update({
        where: { id: booking.id },
        data: {
          status: "APPROVED",
          meetingLink,
          mentorNotes: validatedData.notes,
        },
        include: {
          timeSlot: {
            include: {
              sessionSchedule: true
            }
          },
          student: true,
          payment: true
        }
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: booking.paymentId! },
        data: {
          status: "COMPLETED"
        }
      });

      return NextResponse.json({
        message: "Booking approved successfully",
        booking: updatedBooking
      });
    } else {
      // Reject booking
      const updatedBooking = await prisma.$transaction(async (tx) => {
        // Update booking status
        const booking = await tx.sessionBooking.update({
          where: { id: validatedData.bookingId },
          data: {
            status: "REJECTED",
            mentorNotes: validatedData.notes,
            rejectionReason: validatedData.rejectionReason
          }
        });

        // Free up the time slot
        await tx.timeSlot.update({
          where: { id: booking.timeSlotId },
          data: { isBooked: false }
        });

        // Update payment status for refund
        await tx.payment.update({
          where: { id: booking.paymentId! },
          data: { status: "REFUNDED" }
        });

        return booking;
      });

      return NextResponse.json({
        message: "Booking rejected",
        booking: updatedBooking
      });
    }

  } catch (error) {
    console.error("Error processing mentor approval:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 