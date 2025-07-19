"use client";
import SampleView from "@/components/sample-view";
import { prisma } from "@/lib/prisma";
// import { Sample } from "@/lib/generated/prisma";
import { addSample, deleteSample } from "@/server/actions/sample";
// import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

//updated ones
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InteractiveVerticalScrollbar } from "@/components/landing/interactive-vertical-scrollbar";
import RoleSelectionModal from "@/components/login/RoleSelectionModal";
import { AnimatedFeatureCards } from "@/components/landing/animated-feature-cards";
import { MentorCard } from "@/components/landing/MentorCard";
export default function Home() {
  // const samples = await prisma.sample.findMany();
  // return <SampleView initialSamples={samples} />;

  const [isActiveGetStarted, setIsActiveGetStarted] = useState(false);

  // Mentors data
  const mentors = [
    {
      id: "1",
      name: "Rahul Lavan",
      initials: "RL",
      location: "Colombia",
      subjects: ["Science", "Physics", "Biology"],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
      duration: "30 mins - 1 hour",
      preferredLanguage: "English, Tamil",
      avatarColor: "text-blue-600",
      avatarBgColor: "bg-blue-100"
    },
    {
      id: "2",
      name: "Chathum Rahal",
      initials: "CR",
      location: "Galle",
      subjects: ["Mathematics", "History", "English"],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
      duration: "1 hour",
      preferredLanguage: "English",
      avatarColor: "text-orange-600",
      avatarBgColor: "bg-orange-100"
    },
    {
      id: "3",
      name: "Malsha Fernando",
      initials: "MF",
      location: "Colombo",
      subjects: ["Chemistry", "Art", "Commerce"],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.",
      duration: "1 hour",
      preferredLanguage: "Sinhala",
      avatarColor: "text-purple-600",
      avatarBgColor: "bg-purple-100"
    }
  ];

  // Handler functions
  const handleBookSession = (mentorId: string) => {
    console.log(`Booking session with mentor: ${mentorId}`);
    // Add your booking logic here
  };

  const handleToggleFavorite = (mentorId: string) => {
    console.log(`Toggling favorite for mentor: ${mentorId}`);
    // Add your favorite toggle logic here
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9]">
      {/* Header */}
      <header className="border-b rounded-b-3xl max-w-7xl bg-white mx-auto border-gray-100 px-4 lg:px-10">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduVibe</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xl">
            <Link
              href="#"
              className="text-gray-900 font-medium hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Sessions
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              About
            </Link>
          </nav>

          <Button
            onClick={() => setIsActiveGetStarted(true)}
            className="bg-black hover:bg-purple-700 text-white px-6"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-6 py-12 lg:py-20 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight ">
                Empowering Students with Personalized Mentorship{" "}
                <span>
                  <BookOpen className=" inline-block h-8 w-8 text-black" />
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                EduVibe connects students with experienced mentors to guide them
                through their academic beyond.
              </p>
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
              >
                Get Started
              </Button>
            </div>

            <div className="relative h-[600px]">
              <InteractiveVerticalScrollbar />
            </div>
          </div>
        </div>
      </section>

      {/* What's in it for Students Section */}
      <div className={`w-full bg-[url("/elipsesGroup.png")] bg-no-repeat bg-cover bg-center`}>
        <section className="px-4 lg:px-6 py-16 max-w-7xl mx-auto">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What's in it for Students?
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                EduVibe is a student-mentor platform designed to personalize
                learning journeys. It connects students with mentors who offer
                guidance, support, and practical industry insights.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="rounded-3xl shadow-sm">
                <AnimatedFeatureCards />
              </div>
            </div>
          </div>
        </section>

        {/* Session Highlights Section */}
        <section className="px-4 lg:px-6 py-16 ">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Session Highlights – Trending Now
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                Join the sessions students are raving about. These expert-led,
                high-impact sessions are designed to help you unlock your full
                potential whether you're polishing your resume, mapping out your
                career path, or getting ready to ace technical interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onBookSession={handleBookSession}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Load More Sessions
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white px-4 lg:px-6 py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduVibe</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering students with personalized mentorship and guidance
                for academic and career success.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Find Mentors
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Book Sessions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduVibe. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
      {isActiveGetStarted && (
        <RoleSelectionModal
          setIsActiveGetStarted={setIsActiveGetStarted}
          isActiveGetStarted={isActiveGetStarted}
        />
      )}
    </div>
  );
}
