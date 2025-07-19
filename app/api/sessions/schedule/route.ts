import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Validation schema for creating a session schedule
const createScheduleSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  duration: z.number().min(30).max(180), // Duration in minutes
  price: z.number().positive(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  availableDays: z.array(z.number().min(0).max(6)), // 0 = Sunday, 6 = Saturday
  dailySlots: z.array(z.object({
    startTime: z.string(), // Format: "HH:mm"
    endTime: z.string(),   // Format: "HH:mm"
  }))
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
    const validatedData = createScheduleSchema.parse(body);

    // Create session schedule
    const sessionSchedule = await prisma.sessionSchedule.create({
      data: {
        mentorId: mentorProfile.id,
        title: validatedData.title,
        description: validatedData.description,
        duration: validatedData.duration,
        price: validatedData.price,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
      }
    });

    // Generate time slots
    const timeSlots = generateTimeSlots(
      validatedData.startDate,
      validatedData.endDate,
      validatedData.availableDays,
      validatedData.dailySlots,
      validatedData.duration
    );

    // Create time slots in database
    await prisma.timeSlot.createMany({
      data: timeSlots.map(slot => ({
        sessionScheduleId: sessionSchedule.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false
      }))
    });

    return NextResponse.json({
      message: "Session schedule created successfully",
      sessionSchedule
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating session schedule:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get("mentorId");

    const schedules = await prisma.sessionSchedule.findMany({
      where: mentorId ? { mentorId } : undefined,
      include: {
        timeSlots: {
          where: {
            startTime: { gte: new Date() },
            isBooked: false
          }
        }
      }
    });

    return NextResponse.json(schedules);

  } catch (error) {
    console.error("Error fetching session schedules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to generate time slots
function generateTimeSlots(
  startDate: Date,
  endDate: Date,
  availableDays: number[],
  dailySlots: { startTime: string; endTime: string }[],
  duration: number
) {
  const timeSlots = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Check if current day is in available days
    if (availableDays.includes(currentDate.getDay())) {
      for (const slot of dailySlots) {
        const [startHour, startMinute] = slot.startTime.split(":").map(Number);
        const [endHour, endMinute] = slot.endTime.split(":").map(Number);
        
        const slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMinute, 0, 0);
        
        const slotEnd = new Date(currentDate);
        slotEnd.setHours(endHour, endMinute, 0, 0);

        // Generate slots based on duration
        let currentSlotStart = new Date(slotStart);
        while (currentSlotStart < slotEnd) {
          const currentSlotEnd = new Date(currentSlotStart.getTime() + duration * 60000);
          if (currentSlotEnd <= slotEnd) {
            timeSlots.push({
              startTime: new Date(currentSlotStart),
              endTime: new Date(currentSlotEnd)
            });
          }
          currentSlotStart = currentSlotEnd;
        }
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return timeSlots;
} 