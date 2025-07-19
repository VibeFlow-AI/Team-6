"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set } from "zod/v4-mini";

interface RoleSelectionModalProps {
  isActiveGetStarted: boolean;
  setIsActiveGetStarted: (isActive: boolean) => void;
}

export default function RoleSelectionModal({
  setIsActiveGetStarted,
}: RoleSelectionModalProps) {
  const router = useRouter();

  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");

  const handleRoleSelection = (selectedRole: "STUDENT" | "MENTOR") => {
    setRole(selectedRole);
    setIsActiveGetStarted(false);
    router.push(`/login?role=${selectedRole.toLocaleLowerCase()}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Get Started</h2>
          <button
            onClick={() => setIsActiveGetStarted(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sign Up as a Mentor */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Sign Up as a Mentor</h3>
            <Button
              onClick={() => handleRoleSelection("MENTOR")}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Continue as a Mentor
            </Button>
          </div>

          {/* Sign Up as a Student */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Sign Up as a Student</h3>
            <Button
              onClick={() => handleRoleSelection("STUDENT")}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Continue as a Student
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsActiveGetStarted(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Origin
          </button>
        </div>
      </div>
    </div>
  );
}
