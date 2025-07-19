import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { baseUserSchema, studentProfileSchema, mentorProfileSchema } from "../validation";
import { AUTH_ERRORS, AuthError } from "../errors";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate base user data
    const baseUserData = baseUserSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: baseUserData.email }
    });

    if (existingUser) {
      throw AUTH_ERRORS.USER_EXISTS;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(baseUserData.password, 12);

    // Create user transaction based on role
    const result = await prisma.$transaction(async (tx) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          email: baseUserData.email,
          password: hashedPassword,
          role: baseUserData.role,
          provider: "CREDENTIALS"
        }
      });

      // Create role-specific profile
      if (baseUserData.role === "STUDENT") {
        const studentData = studentProfileSchema.parse(body);
        await tx.studentProfile.create({
          data: {
            userId: user.id,
            fullName: studentData.fullName,
            age: studentData.age,
            contactNumber: studentData.contactNumber,
            educationLevel: studentData.educationLevel,
            school: studentData.school,
            subjectsOfInterest: studentData.subjectsOfInterest,
            currentYear: studentData.currentYear,
            learningStyle: studentData.learningStyle,
            hasDisability: studentData.hasDisability,
            disabilityDesc: studentData.disabilityDesc,
          }
        });
      } else {
        const mentorData = mentorProfileSchema.parse(body);
        await tx.mentorProfile.create({
          data: {
            userId: user.id,
            fullName: mentorData.fullName,
            age: mentorData.age,
            contactNumber: mentorData.contactNumber,
            preferredLanguage: mentorData.preferredLanguage,
            currentLocation: mentorData.currentLocation,
            shortBio: mentorData.shortBio,
            professionalRole: mentorData.professionalRole,
            subjectsToTeach: mentorData.subjectsToTeach,
            experienceYears: mentorData.experienceYears,
            preferredStudentLevels: mentorData.preferredStudentLevels,
            linkedIn: mentorData.linkedIn,
            githubPortfolio: mentorData.githubPortfolio,
            profilePicture: mentorData.profilePicture,
          }
        });
      }

      return user;
    });

    return NextResponse.json(
      { 
        message: "Registration successful",
        userId: result.id,
        role: result.role
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 