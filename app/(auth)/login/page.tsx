"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Facebook, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }
    // Wait for session to be available
    let session = null;
    for (let i = 0; i < 10; i++) {
      session = await getSession();
      if (session?.user?.role) break;
      await new Promise(r => setTimeout(r, 200));
    }
    if (!session?.user?.role) {
      setLoading(false);
      setError("Could not determine user role. Try again.");
      return;
    }
    // Check profile existence
    let profileRes;
    if (session.user.role === "MENTOR") {
      profileRes = await fetch("/api/mentors/profile", { method: "GET" });
      if (profileRes.ok) {
        router.push("/mentor");
      } else {
        router.push("/mentor/onboarding");
      }
    } else if (session.user.role === "STUDENT") {
      profileRes = await fetch("/api/students/profile", { method: "GET" });
      if (profileRes.ok) {
        router.push("/student");
      } else {
        router.push("/student/onboarding");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleProvider = (provider: string) => {
    setLoading(true);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">Sign in to EduVibe</h1>
        <p className="text-gray-500 text-center mb-6">Mentorship made easy for students and mentors.</p>

        <form className="space-y-4" onSubmit={handleCredentialsLogin}>
          <Input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleProvider("google")}
            disabled={loading}
          >
            {/* Replace <Google /> with a suitable icon, e.g. from lucide-react */}
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
              <g>
                <path fill="#4285F4" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.227 0-3.438 2.75-6.227 6.125-6.227 1.922 0 3.211.82 3.953 1.523l2.703-2.633C17.07 2.82 14.977 1.75 12.04 1.75 6.617 1.75 2.25 6.117 2.25 11.54c0 5.422 4.367 9.79 9.79 9.79 5.633 0 9.375-3.953 9.375-9.523 0-.641-.07-1.133-.16-1.584z"/>
                <path fill="#34A853" d="M3.545 7.345l3.281 2.406c.891-1.719 2.578-2.953 4.514-2.953 1.094 0 2.125.375 2.922 1.016l2.75-2.672C15.07 3.82 13.07 2.75 10.04 2.75c-3.375 0-6.125 2.789-6.125 6.227 0 1.016.258 1.977.63 2.818z"/>
                <path fill="#FBBC05" d="M12.04 21.33c2.93 0 5.383-.969 7.18-2.633l-3.305-2.703c-.914.617-2.086.984-3.875.984-3.07 0-5.664-2.07-6.594-4.883l-3.32 2.57c1.781 3.523 5.523 5.665 9.914 5.665z"/>
                <path fill="#EA4335" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.227 0-.641.07-1.133.16-1.584l.002-.002 3.281 2.406c.891-1.719 2.578-2.953 4.514-2.953 1.094 0 2.125.375 2.922 1.016l2.75-2.672C17.07 3.82 14.977 2.75 12.04 2.75c-3.375 0-6.125 2.789-6.125 6.227 0 1.016.258 1.977.63 2.818l3.281 2.406c.891-1.719 2.578-2.953 4.514-2.953 1.094 0 2.125.375 2.922 1.016l2.75-2.672C17.07 3.82 14.977 2.75 12.04 2.75c-3.375 0-6.125 2.789-6.125 6.227 0 1.016.258 1.977.63 2.818z"/>
              </g>
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleProvider("github")}
            disabled={loading}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleProvider("facebook")}
            disabled={loading}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            Continue with Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleProvider("email")}
            disabled={loading}
          >
            <Mail className="w-5 h-5 text-green-600" />
            Continue with Email Link
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
} 