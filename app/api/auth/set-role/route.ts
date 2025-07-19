import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check for session or email in session
    if (!session?.user?.email) {
      // If no session, try to get email from request body
      const { email, role } = await req.json();
      
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }
      
      if (role !== "MENTOR" && role !== "STUDENT") {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      // Update user role directly using email
      await prisma.user.update({
        where: { email },
        data: { role },
      });

      return NextResponse.json({ 
        success: true,
        message: "Role updated successfully. Please log in again."
      });
    }

    // If session exists, proceed with normal flow
    const { role } = await req.json();
    
    if (role !== "MENTOR" && role !== "STUDENT") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

    return NextResponse.json({ 
      success: true,
      message: "Role updated successfully"
    });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({ 
      error: "Failed to update role" 
    }, { status: 500 });
  }
} 