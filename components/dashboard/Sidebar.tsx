"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  MessageSquare,
  BarChart3,
  Star,
  Clock
} from "lucide-react";

interface SidebarProps {
  userRole: "mentor" | "student";
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const mentorNavItems = [
    {
      label: "Dashboard",
      href: "/mentor",
      icon: Home,
    },
    {
      label: "Sessions",
      href: "/mentor/sessions",
      icon: Calendar,
    },
    {
      label: "Students",
      href: "/mentor/students",
      icon: Users,
    },
    {
      label: "Analytics",
      href: "/mentor/analytics",
      icon: BarChart3,
    },
    {
      label: "Messages",
      href: "/mentor/messages",
      icon: MessageSquare,
    },
    {
      label: "Profile",
      href: "/mentor/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/mentor/settings",
      icon: Settings,
    },
  ];

  const studentNavItems = [
    {
      label: "Dashboard",
      href: "/student",
      icon: Home,
    },
    {
      label: "Explore Mentors",
      href: "/student/explore",
      icon: Search,
    },
    {
      label: "My Sessions",
      href: "/student/sessions",
      icon: Calendar,
    },
    {
      label: "My Mentors",
      href: "/student/mentors",
      icon: Users,
    },
    {
      label: "Messages",
      href: "/student/messages",
      icon: MessageSquare,
    },
    {
      label: "Progress",
      href: "/student/progress",
      icon: BarChart3,
    },
    {
      label: "Favorites",
      href: "/student/favorites",
      icon: Star,
    },
    {
      label: "Profile",
      href: "/student/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/student/settings",
      icon: Settings,
    },
  ];

  const navItems = userRole === "mentor" ? mentorNavItems : studentNavItems;

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">
              {userRole === "mentor" ? "Mentor Hub" : "Student Portal"}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isCollapsed ? "mx-auto" : "mr-3",
                    isActive ? "text-blue-700" : "text-gray-400"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userRole === "mentor" ? "Mentor Name" : "Student Name"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRole === "mentor" ? "Physics Expert" : "Physics Student"}
              </p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Sign out"}
        </Button>
      </div>
    </div>
  );
}
