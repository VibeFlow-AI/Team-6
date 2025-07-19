"use client";

import React from "react";
import { useState } from "react";
import { X, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoleSelectionModal from "./RoleSelectionModal";

interface AuthModalProps {
  onClose: () => void;
}

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleContinue = () => {
    // For demo purposes, show role selection for new users
    setShowRoleSelection(true);
  };

//   if (showRoleSelection) {
//     return (
//       <RoleSelectionModal
//       />
//     );
//   }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sign in to EduVibe</h2>
          {/* <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button> */}
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Welcome back! please sign in to continue
        </p>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
            <span className="text-lg">G</span>
            Continue with Google
          </Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
            <span className="text-lg">f</span>
            Continue with Facebook
          </Button>
          <Button className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
            <Github size={18} />
            Continue with GitHub
          </Button>
        </div>

        <div className="text-center text-gray-500 mb-4">--- or ---</div>

        {/* Email Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="Enter your email"
            />
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            Continue
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
