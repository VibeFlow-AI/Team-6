"use client";

import { useState } from "react";
import { Home, Edit, Play, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Navbar from "./Navbar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Mock data for analytics
const ageDistributionData = [
  { name: "13-15 years", value: 35, color: "#8884d8" },
  { name: "16-18 years", value: 45, color: "#82ca9d" },
  { name: "19-21 years", value: 20, color: "#ffc658" },
];

const subjectInterestData = [
  { subject: "Physics", students: 25 },
  { subject: "Mathematics", students: 30 },
  { subject: "Chemistry", students: 20 },
  { subject: "Biology", students: 15 },
  { subject: "English", students: 18 },
  { subject: "History", students: 12 },
];

// Mock upcoming sessions data
const upcomingSessions = [
  {
    id: "1",
    studentName: "Sarah Johnson",
    studentInitial: "S",
    subject: "Physics",
    date: "2024-01-20",
    time: "10:00 AM",
    duration: "2 hours",
    studentAge: 17,
    requestTime: "2024-01-15T09:30:00Z",
  },
  {
    id: "2",
    studentName: "Alex Chen",
    studentInitial: "A",
    subject: "Mathematics",
    date: "2024-01-20",
    time: "2:00 PM",
    duration: "2 hours",
    studentAge: 16,
    requestTime: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    studentName: "Victoria Smith",
    studentInitial: "V",
    subject: "Chemistry",
    date: "2024-01-21",
    time: "11:00 AM",
    duration: "2 hours",
    studentAge: 18,
    requestTime: "2024-01-16T11:45:00Z",
  },
];

export default function MentorDashboard() {
  const [sessions, setSessions] = useState(upcomingSessions);

  // Sort sessions by date in ascending order
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleStartSession = (sessionId: string) => {
    // In a real app, this would start a video call or redirect to session room
    console.log(`Starting session ${sessionId}`);
    alert(`Starting session ${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatRequestTime = (timeString: string) => {
    return new Date(timeString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile Navigation */}
        <div className="sm:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Mentor Dashboard
            </h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg bg-gray-100">
                <Home size={18} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-lg">
                <Edit size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* <Navbar /> */}

        <div className="flex">
          {/* Sidebar */}
          {/* <div className="hidden sm:flex w-16 bg-white border-r border-gray-200 flex-col items-center py-6 space-y-6">
          <button className="p-3 rounded-lg bg-gray-100">
            <Home size={20} className="text-gray-600" />
          </button>
          <button className="p-3 rounded-lg">
            <Edit size={20} className="text-gray-400" />
          </button>
        </div> */}

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mentor Dashboard
              </h1>
              <p className="text-gray-600">Welcome to your mentoring journey</p>
            </div>
            {/* Analytics Section */}
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {/* Age Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Student Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {ageDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {ageDistributionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div
                          className={`w-3 h-3 rounded-full`}
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                        <span className="ml-auto font-medium">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Interest Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Subject Interest Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectInterestData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="subject" type="category" width={80} />
                        <Tooltip
                          formatter={(value) => [`${value}`, "Students"]}
                        />
                        <Bar
                          dataKey="students"
                          fill="#8884d8"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sessions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">
                  All Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {/* Student Avatar */}
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {session.studentInitial}
                      </div>

                      {/* Session Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                          <h3 className="font-semibold text-lg">
                            {session.studentName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            Age {session.studentAge}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Subject:</span>{" "}
                            {session.subject}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {formatDate(session.date)}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>{" "}
                            {session.time}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>{" "}
                            {session.duration}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Requested on {formatRequestTime(session.requestTime)}
                        </div>
                      </div>

                      {/* Start Session Button */}
                      <Button
                        onClick={() => handleStartSession(session.id)}
                        className="bg-gray-600 text-white hover:bg-gray-700 px-4 sm:px-6 py-2 shrink-0 w-full sm:w-auto"
                      >
                        <Play size={16} className="mr-2" />
                        Start Session
                      </Button>
                    </div>
                  ))}

                  {sortedSessions.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No Upcoming Sessions
                      </h3>
                      <p className="text-gray-500">
                        You don't have any sessions scheduled at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {ageDistributionData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        )}
                      </p>
                      <p className="text-gray-600">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar size={24} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {sortedSessions.length}
                      </p>
                      <p className="text-gray-600">Upcoming Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Edit size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {subjectInterestData.length}
                      </p>
                      <p className="text-gray-600">Subjects Taught</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Profile Picture in Bottom Left */}
        <div className="fixed bottom-6 left-4 sm:left-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
