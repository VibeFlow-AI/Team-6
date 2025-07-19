import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { AUTH_ERRORS, AuthError } from "../errors";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // First check if user exists and has a role
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    });

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      throw AUTH_ERRORS.INVALID_CREDENTIALS;
    }

    // Return different response based on role status
    return NextResponse.json({ 
      message: "Login successful",
      ok: true,
      redirectTo: user?.role ? undefined : "/role-selection" // Redirect to role selection if no role
    });

  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 