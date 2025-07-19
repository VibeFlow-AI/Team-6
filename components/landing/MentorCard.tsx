"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    initials: string;
    location: string;
    subjects: string[];
    description: string;
    duration: string;
    preferredLanguage: string;
    avatarColor: string;
    avatarBgColor: string;
  };
  onBookSession?: (mentorId: string) => void;
  onToggleFavorite?: (mentorId: string) => void;
}

export function MentorCard({ mentor, onBookSession, onToggleFavorite }: MentorCardProps) {
  const handleBookSession = () => {
    if (onBookSession) {
      onBookSession(mentor.id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(mentor.id);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0 pb-0 overflow-hidden">
      <CardContent className="px-6 pt-6 pb-0 relative min-h-[400px]">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 ${mentor.avatarBgColor} rounded-full flex items-center justify-center`}>
            <span className={`${mentor.avatarColor} font-semibold text-sm`}>
              {mentor.initials}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {mentor.name}
            </h3>
            <p className="text-sm text-gray-500">{mentor.location}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.subjects.map((subject, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {subject}
            </Badge>
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {mentor.description}
        </p>

        <div className="space-y-1 mb-6 text-xs text-gray-500">
          <p>
            <span className="font-medium">Duration:</span> {mentor.duration}
          </p>
          <p>
            <span className="font-medium">Preferred Language:</span>{" "}
            {mentor.preferredLanguage}
          </p>
        </div>

        <div className="w-[90%] absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-x-2 bg-[#D9D9D9] p-4 rounded-t-lg">
          <Button 
            onClick={handleBookSession}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-[50px] text-sm"
          >
            Book a session
          </Button>
          <Button
            onClick={handleToggleFavorite}
            variant="outline"
            size="icon"
            className="border-gray-300 bg-transparent h-[50px]"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
  );
}
