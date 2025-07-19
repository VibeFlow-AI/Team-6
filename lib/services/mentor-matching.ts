import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import type { StudentProfile, MentorProfile } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MatchResult {
  score: number;
  matchReason: string;
}

export async function findSuitableMentors(studentId: string): Promise<Array<{ mentor: MentorProfile, compatibility: MatchResult }>> {
  // Get student profile with all details
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      skillLevels: true,
    }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Get all mentors
  const mentors = await prisma.mentorProfile.findMany();

  // Generate matches using OpenAI
  const matches = await Promise.all(
    mentors.map(mentor => calculateCompatibility(student, mentor))
  );

  // Filter and sort matches
  const validMatches = matches
    .filter(match => match.compatibility.score > 0.5) // Only include matches with >50% compatibility
    .sort((a, b) => b.compatibility.score - a.compatibility.score);

  return validMatches;
}

async function calculateCompatibility(
  student: StudentProfile,
  mentor: MentorProfile
): Promise<{ mentor: MentorProfile, compatibility: MatchResult }> {
  try {
    const prompt = generateMatchingPrompt(student, mentor);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational counselor who matches students with mentors. Analyze the compatibility between a student and mentor based on their profiles. Return a JSON object with a compatibility score (0-1) and a detailed explanation of the match."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    return {
      mentor,
      compatibility: {
        score: result.score,
        matchReason: result.matchReason
      }
    };
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    // Return low compatibility score in case of error
    return {
      mentor,
      compatibility: {
        score: 0,
        matchReason: "Error calculating compatibility"
      }
    };
  }
}

function generateMatchingPrompt(student: StudentProfile, mentor: MentorProfile): string {
  return `
Student Profile:
- Education Level: ${student.educationLevel}
- Subjects of Interest: ${student.subjectsOfInterest.join(', ')}
- Learning Style: ${student.learningStyle}
- Current Year: ${student.currentYear}
- Has Disability: ${student.hasDisability}
${student.hasDisability ? `- Disability Description: ${student.disabilityDesc}` : ''}
- Skill Levels: ${student.skillLevels.map(skill => `${skill.subject}: ${skill.level}`).join(', ')}

Mentor Profile:
- Subjects to Teach: ${mentor.subjectsToTeach.join(', ')}
- Experience Years: ${mentor.experienceYears}
- Preferred Student Levels: ${mentor.preferredStudentLevels.join(', ')}
- Preferred Language: ${mentor.preferredLanguage}
- Professional Role: ${mentor.professionalRole}

Please analyze the compatibility between this student and mentor. Consider:
1. Subject match
2. Education level compatibility
3. Learning style and teaching approach
4. Language preferences
5. Special needs accommodation if applicable

Return a JSON object with:
{
  "score": (0-1 compatibility score),
  "matchReason": "Detailed explanation of why this is or isn't a good match"
}`;
} 