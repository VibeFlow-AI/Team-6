import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Validation schema for bank transfer verification
const verifyBankTransferSchema = z.object({
  bookingId: z.string(),
  action: z.enum(["VERIFY", "REJECT"]),
  notes: z.string().optional(),
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
    const validatedData = verifyBankTransferSchema.parse(body);

    // Get booking details
    const booking = await prisma.sessionBooking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        timeSlot: {
          include: {
            sessionSchedule: true
          }
        },
        payment: true,
        student: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify mentor owns this session
    if (booking.timeSlot.sessionSchedule.mentorId !== mentorProfile.id) {
      return NextResponse.json({ error: "Not authorized to verify this payment" }, { status: 403 });
    }

    // Verify payment is pending and is bank transfer
    if (booking.payment?.status !== "PENDING" || booking.payment?.paymentMethod !== "BANK_TRANSFER") {
      return NextResponse.json({ error: "Invalid payment status or method" }, { status: 400 });
    }

    // Update payment and booking status
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.update({
        where: { id: booking.payment!.id },
        data: {
          status: validatedData.action === "VERIFY" ? "VERIFIED" : "REJECTED",
          verifiedAt: new Date(),
          verifiedBy: mentorProfile.id
        }
      });

      // Update booking status
      return await tx.sessionBooking.update({
        where: { id: booking.id },
        data: {
          status: validatedData.action === "VERIFY" ? "PENDING_MENTOR_APPROVAL" : "CANCELLED",
          paymentStatus: validatedData.action === "VERIFY" ? "VERIFIED" : "REJECTED",
          mentorNotes: validatedData.notes
        },
        include: {
          timeSlot: {
            include: {
              sessionSchedule: true
            }
          },
          payment: true,
          student: true
        }
      });
    });

    // If payment is rejected, free up the time slot
    if (validatedData.action === "REJECT") {
      await prisma.timeSlot.update({
        where: { id: booking.timeSlotId },
        data: { isBooked: false }
      });
    }

    return NextResponse.json({
      message: `Payment ${validatedData.action === "VERIFY" ? "verified" : "rejected"} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Error verifying bank transfer:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 