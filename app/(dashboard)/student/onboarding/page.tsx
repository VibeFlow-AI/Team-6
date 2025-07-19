"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// API Route Logic
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Debug: log the incoming data
    console.log("Received onboarding data:", data);

    // List of required fields
    const requiredFields = [
      "fullName",
      "age",
      "contactNumber",
      "educationLevel",
      "school",
      "subjects",
      "currentYear",
      "subjectSkills",
      "learningStyle",
    ];

    // Check for missing fields and log which one is missing
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Use a mock userId for now (since no authentication)
    const mockUserId = "mock-user-id";

    // Save or update student profile
    const student = await prisma.studentProfile.upsert({
      where: { userId: mockUserId },
      update: {
        fullName: data.fullName,
        age: parseInt(data.age, 10),
        contactNumber: data.contactNumber,
        educationLevel: data.educationLevel,
        school: data.school,
        subjectsOfInterest: data.subjects.split(",").map((s: string) => s.trim()),
        currentYear: parseInt(data.currentYear, 10),
        skillLevels: data.subjectSkills,
        learningStyle: data.learningStyle,
        hasDisability: data.hasDisability === "Yes",
        disabilityDesc: data.disabilityDesc,
      },
      create: {
        userId: mockUserId,
        fullName: data.fullName,
        age: parseInt(data.age, 10),
        contactNumber: data.contactNumber,
        educationLevel: data.educationLevel,
        school: data.school,
        subjectsOfInterest: data.subjects.split(",").map((s: string) => s.trim()),
        currentYear: parseInt(data.currentYear, 10),
        skillLevels: data.subjectSkills,
        learningStyle: data.learningStyle,
        hasDisability: data.hasDisability === "Yes",
        disabilityDesc: data.disabilityDesc,
      },
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

// Page Component
type Step = 1 | 2 | 3;

const educationLevels = [
  "Grade 9",
  "Ordinary Level", 
  "Advanced Level",
];

const learningStyles = [
  "Visual",
  "Hands-On",
  "Theoretical",
  "Mixed",
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export default function StudentOnboarding() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    educationLevel: "",
    school: "",
    subjects: "",
    currentYear: "",
    subjectSkills: {} as Record<string, string>,
    learningStyle: "",
    hasDisability: "No",
    disabilityDesc: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subjectList = form.subjects
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (subject: string, level: string) => {
    setForm((prev) => ({
      ...prev,
      subjectSkills: { ...prev.subjectSkills, [subject]: level },
    }));
  };

  const nextStep = () => setStep((s) => (s < 3 ? (s + 1) as Step : s));
  const prevStep = () => setStep((s) => (s > 1 ? (s - 1) as Step : s));

  // Frontend validation
  const validate = () => {
    if (!form.fullName || !form.age || !form.email || !form.contactNumber) return false;
    if (!form.educationLevel || !form.school) return false;
    if (!form.subjects || !form.currentYear || !form.learningStyle) return false;
    if (subjectList.length && Object.keys(form.subjectSkills).length !== subjectList.length) return false;
    if (form.hasDisability === "Yes" && !form.disabilityDesc) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Redirect to student dashboard after successful onboarding
        setTimeout(() => router.push("/student"), 1500);
      } else {
        setError(data.error || "Submission failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Onboarding</h1>
          <p className="text-gray-600">Complete your profile to get started</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600">Onboarding complete! 🎉</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Who Are You?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={form.age}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          value={form.contactNumber}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Academic Background</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="educationLevel">Current Education Level</Label>
                        <select
                          id="educationLevel"
                          name="educationLevel"
                          value={form.educationLevel}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Education Level...</option>
                          {educationLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="school">School</Label>
                        <Input
                          id="school"
                          name="school"
                          value={form.school}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Subject & Skill Assessment</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subjects">Subjects of Interest (comma separated)</Label>
                        <Input
                          id="subjects"
                          name="subjects"
                          value={form.subjects}
                          onChange={handleChange}
                          placeholder="e.g., Mathematics, Physics, Chemistry"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentYear">Current Year</Label>
                        <Input
                          id="currentYear"
                          name="currentYear"
                          type="number"
                          value={form.currentYear}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      {subjectList.length > 0 && (
                        <div className="space-y-3">
                          <Label>Current Skill Level (Per Subject)</Label>
                          {subjectList.map((subject) => (
                            <div key={subject} className="p-3 border border-gray-200 rounded-md">
                              <p className="font-medium mb-2">{subject}:</p>
                              <div className="flex space-x-4">
                                {skillLevels.map((level) => (
                                  <label key={level} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`skill-${subject}`}
                                      checked={form.subjectSkills[subject] === level}
                                      onChange={() => handleSkillChange(subject, level)}
                                      required
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{level}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <Label htmlFor="learningStyle">Preferred Learning Style</Label>
                        <select
                          id="learningStyle"
                          name="learningStyle"
                          value={form.learningStyle}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Learning Style...</option>
                          {learningStyles.map((style) => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label>Do you have any learning disabilities or accommodations needed?</Label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="hasDisability"
                              value="No"
                              checked={form.hasDisability === "No"}
                              onChange={handleChange}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>No</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="hasDisability"
                              value="Yes"
                              checked={form.hasDisability === "Yes"}
                              onChange={handleChange}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span>Yes</span>
                          </label>
                        </div>
                        
                        {form.hasDisability === "Yes" && (
                          <div>
                            <Label htmlFor="disabilityDesc">Please describe</Label>
                            <Input
                              id="disabilityDesc"
                              name="disabilityDesc"
                              value={form.disabilityDesc}
                              onChange={handleChange}
                              required={form.hasDisability === "Yes"}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="ml-auto">
                    {loading ? "Submitting..." : "Complete Onboarding"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}