import { z } from "zod";

export const baseUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "MENTOR"], {
    errorMap: () => ({ message: "Role must be either STUDENT or MENTOR" })
  }),
});

export const studentProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.number().int().min(13, "Student must be at least 13 years old"),
  contactNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  educationLevel: z.enum(["GRADE_9", "ORDINARY_LEVEL", "ADVANCED_LEVEL"], {
    errorMap: () => ({ message: "Invalid education level" })
  }),
  school: z.string().min(2, "School name must be at least 2 characters"),
  subjectsOfInterest: z.array(z.string()).min(1, "At least one subject must be selected"),
  currentYear: z.number().int().min(1).max(13),
  learningStyle: z.enum(["VISUAL", "HANDS_ON", "THEORETICAL", "MIXED"], {
    errorMap: () => ({ message: "Invalid learning style" })
  }),
  hasDisability: z.boolean(),
  disabilityDesc: z.string().optional(),
});

export const mentorProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.number().int().min(18, "Mentor must be at least 18 years old"),
  contactNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  preferredLanguage: z.enum(["ENGLISH", "SINHALA", "TAMIL", "OTHER"], {
    errorMap: () => ({ message: "Invalid language preference" })
  }),
  currentLocation: z.string().min(2, "Location must be at least 2 characters"),
  shortBio: z.string().min(50, "Bio must be at least 50 characters"),
  professionalRole: z.string().min(2, "Professional role must be at least 2 characters"),
  subjectsToTeach: z.array(z.string()).min(1, "At least one subject must be selected"),
  experienceYears: z.enum(["NONE", "YEARS_1_3", "YEARS_3_5", "YEARS_5_PLUS"], {
    errorMap: () => ({ message: "Invalid experience level" })
  }),
  preferredStudentLevels: z.array(
    z.enum(["GRADE_3_5", "GRADE_6_9", "GRADE_10_11", "ADVANCED_LEVEL"], {
      errorMap: () => ({ message: "Invalid student level" })
    })
  ).min(1, "At least one student level must be selected"),
  linkedIn: z.string().url("Invalid LinkedIn URL"),
  githubPortfolio: z.string().url("Invalid GitHub URL").optional(),
  profilePicture: z.string().optional(),
}); 