import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Validation schema for payment verification
const verifyPaymentSchema = z.object({
  bookingId: z.string(),
  transactionId: z.string().optional(),
  status: z.enum(["COMPLETED", "FAILED"]),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = verifyPaymentSchema.parse(body);

    // Get the booking with payment details
    const booking = await prisma.sessionBooking.findUnique({
      where: { id: validatedData.bookingId },
      include: { payment: true }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update payment and booking status
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Update payment status
      await tx.payment.update({
        where: { id: booking.paymentId! },
        data: {
          status: validatedData.status,
          transactionId: validatedData.transactionId,
        }
      });

      // Update booking status
      return await tx.sessionBooking.update({
        where: { id: booking.id },
        data: {
          status: validatedData.status === "COMPLETED" ? "CONFIRMED" : "CANCELLED",
          paymentStatus: validatedData.status,
        },
        include: {
          timeSlot: true,
          payment: true
        }
      });
    });

    // If payment failed, free up the time slot
    if (validatedData.status === "FAILED") {
      await prisma.timeSlot.update({
        where: { id: updatedBooking.timeSlotId },
        data: { isBooked: false }
      });
    }

    return NextResponse.json({
      message: `Payment ${validatedData.status.toLowerCase()}`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 