'use client';
import SampleView from "@/components/sample-view";
import { prisma } from "@/lib/prisma";
// import { Sample } from "@/lib/generated/prisma";
import { addSample, deleteSample } from "@/server/actions/sample";
// import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";



//updated ones
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { InteractiveVerticalScrollbar } from "@/components/landing/interactive-vertical-scrollbar";
import RoleSelectionModal from "@/components/login/RoleSelectionModal";
export default function Home() {
  // const samples = await prisma.sample.findMany();
  // return <SampleView initialSamples={samples} />;

  const [isActiveGetStarted, setIsActiveGetStarted] = useState(false);

  return (
         <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-4 lg:px-52">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduVibe</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xl">
            <Link href="#" className="text-gray-900 font-medium hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Sessions
            </Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              About
            </Link>
          </nav>

          <Button onClick={() => setIsActiveGetStarted(true)} className="bg-black hover:bg-purple-700 text-white px-6">Get Started</Button>
        </div>
      </header>

       {/* Hero Section */}
      <section className="px-4 lg:px-6 py-12 lg:py-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Empowering Students with Personalized Mentorship
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                EduVibe connects students with experienced mentors to guide them through their academic beyond.
              </p>
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3">
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
      <section className="px-4 lg:px-6 py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What's in it for Students?</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              EduVibe is a student-mentor platform designed to personalize learning journeys. It connects students with
              mentors who offer guidance, support, and practical industry insights.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="border-4 border-purple-400 rounded-3xl p-8 bg-white">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Personalized Learning */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Students collaborating"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Learning</h3>
                    <p className="text-gray-600 text-sm">
                      We tailor the mentorship experience to fit each student's unique goals, learning style, and pace
                      making every session impactful.
                    </p>
                  </div>
                </div>

                {/* Real Mentors, Real Guidance */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Professional mentor"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Real Mentors, Real Guidance</h3>
                  </div>
                </div>

                {/* Growth & Career Readiness */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Career growth"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Growth & Career Readiness</h3>
                  </div>
                </div>

                {/* Insights-Driven Support */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Data insights"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Insights-Driven Support</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Session Highlights Section */}
      <section className="px-4 lg:px-6 py-16 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Session Highlights – Trending Now</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Join the sessions students are raving about. These expert-led, high-impact sessions are designed to help
              you unlock your full potential whether you're polishing your resume, mapping out your career path, or
              getting ready to ace technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Rahul Lavan Card */}
            <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">RL</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rahul Lavan</h3>
                    <p className="text-sm text-gray-500">Colombia</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Science
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Physics
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Biology
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it.
                </p>

                <div className="space-y-1 mb-6 text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Duration:</span> 30 mins - 1 hour
                  </p>
                  <p>
                    <span className="font-medium">Preferred Language:</span> English, Tamil
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm">Book a session</Button>
                  <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chathum Rahal Card */}
            <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">CR</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Chathum Rahal</h3>
                    <p className="text-sm text-gray-500">Galle</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Mathematics
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    History
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    English
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it.
                </p>

                <div className="space-y-1 mb-6 text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Duration:</span> 1 hour
                  </p>
                  <p>
                    <span className="font-medium">Preferred Language:</span> English
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm">Book a session</Button>
                  <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Malsha Fernando Card */}
            <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">MF</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Malsha Fernando</h3>
                    <p className="text-sm text-gray-500">Colombo</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Chemistry
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Art
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    Commerce
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it.
                </p>

                <div className="space-y-1 mb-6 text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Duration:</span> 1 hour
                  </p>
                  <p>
                    <span className="font-medium">Preferred Language:</span> Sinhala
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm">Book a session</Button>
                  <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 lg:px-6 py-12">
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
                Empowering students with personalized mentorship and guidance for academic and career success.
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
      </footer>
      {isActiveGetStarted && (<RoleSelectionModal setIsActiveGetStarted={setIsActiveGetStarted} isActiveGetStarted={isActiveGetStarted} />)}
    </div>
  )
}

