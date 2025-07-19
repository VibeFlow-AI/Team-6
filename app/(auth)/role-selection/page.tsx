"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RoleSelectionPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: "MENTOR" | "STUDENT") => {
    setLoading(true);
    // Call API to update user role
    await fetch("/api/auth/set-role", {
      method: "POST",
      body: JSON.stringify({ role }),
      headers: { "Content-Type": "application/json" },
    });
    await update(); // Refresh session
    // Redirect to onboarding
    router.replace(role === "MENTOR" ? "/mentor/onboarding" : "/student/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>
        <div className="flex flex-col gap-4">
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => handleRoleSelect("MENTOR")}
          >
            I am a Mentor
          </Button>
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => handleRoleSelect("STUDENT")}
            variant="outline"
          >
            I am a Student
          </Button>
        </div>
      </div>
    </div>
  );
} 