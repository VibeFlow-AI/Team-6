"use client";

import { usePersistentState } from "@/components/hooks/usePersistentState";
import PersonalInfoForm from "@/components/mentor-onboarding/PersonalInfoForm";
import ExpertiseForm from "@/components/mentor-onboarding/ExpertiseForm";
import SocialLinksForm from "@/components/mentor-onboarding/SocialLinksForm";
import { Button } from "@/components/ui/button";

const steps = [
  "Personal Information",
  "Areas of Expertise",
  "Social & Professional Links",
];

export default function MentorOnboardingPage() {
  const [step, setStep] = usePersistentState<number>("mentor-onboarding-step", 0);
  const [form, setForm] = usePersistentState<any>("mentor-onboarding-form", {});

  const next = (data: any) => {
    setForm({ ...form, ...data });
    setStep(step + 1);
  };

  const prev = () => setStep(step - 1);

  const handleSubmit = async (data: any) => {
    setForm({ ...form, ...data });
    // TODO: Replace with actual userId from session/auth
    const userId = "replace-with-user-id";
    const payload = { ...form, ...data, userId };
    const res = await fetch("/api/mentors/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      window.localStorage.removeItem("mentor-onboarding-form");
      window.localStorage.removeItem("mentor-onboarding-step");
      alert("Onboarding complete!");
      // Redirect or show success
    } else {
      alert("Error submitting form");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-2xl">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all
                  ${i === step
                    ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg"
                    : i < step
                    ? "bg-blue-100 border-blue-400 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                {i + 1}
              </div>
              <span className={`mt-2 text-xs font-medium ${i === step ? "text-blue-700" : "text-gray-400"}`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className="absolute top-4 right-0 w-full h-0.5 bg-gray-200 z-0" style={{ left: "50%", width: "100%" }} />
              )}
            </div>
          ))}
        </div>
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 0 && (
            <PersonalInfoForm
              defaultValues={form}
              onNext={next}
            />
          )}
          {step === 1 && (
            <ExpertiseForm
              defaultValues={form}
              onNext={next}
              onBack={prev}
            />
          )}
          {step === 2 && (
            <SocialLinksForm
              defaultValues={form}
              onBack={prev}
              onSubmit={handleSubmit}
            />
          )}
        </div>
        {/* Optional: Back to Home or Cancel button */}
        <div className="flex justify-center mt-6">
          <Button variant="ghost" className="text-gray-500" onClick={() => window.location.href = "/"}>
            Cancel Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
} 