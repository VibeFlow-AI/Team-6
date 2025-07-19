import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorCard } from "@/components/landing/MentorCard";

// Placeholder types
interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  meetingLink?: string;
  timeSlot: {
    startTime: string;
    endTime: string;
    sessionSchedule: {
      title: string;
      mentor: { name: string };
      price: number;
    };
  };
  payment: {
    paymentMethod: string;
    status: string;
  };
}

interface MentorMatch {
  session: any;
  compatibility: { score: number; matchReason: string };
}

export default function StudentSessions() {
  // State for bookings and mentors
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mentorMatches, setMentorMatches] = useState<MentorMatch[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  // Fetch bookings and mentors (placeholder, to be replaced with real fetch)
  useEffect(() => {
    // TODO: Fetch from /api/sessions/book and /api/sessions/find-mentors
    setBookings([]); // Placeholder
    setMentorMatches([]); // Placeholder
  }, []);

  // Handlers
  const handleBookSession = (mentorId: string) => {
    setSelectedMentor(mentorId);
    setShowBookingModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Sessions</h1>
      <div className="mb-10">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No sessions booked yet.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-md">
                <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {booking.timeSlot.sessionSchedule.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Mentor: {booking.timeSlot.sessionSchedule.mentor.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.timeSlot.startTime).toLocaleString()} - {new Date(booking.timeSlot.endTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="secondary">{booking.status}</Badge>
                    <Badge variant="outline">{booking.paymentStatus}</Badge>
                    {booking.meetingLink && (
                      <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Join Meeting</a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Recommended Mentors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentorMatches.length === 0 ? (
          <p className="text-gray-500 col-span-2">No mentor recommendations available.</p>
        ) : (
          mentorMatches.map((match, idx) => (
            <MentorCard
              key={idx}
              mentor={match.session.mentor}
              onBookSession={handleBookSession}
            />
          ))
        )}
      </div>

      {/* Booking Modal Placeholder */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Book a Session</h3>
            <p>Booking form for mentor: {selectedMentor}</p>
            {/* TODO: Implement booking form */}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowBookingModal(false)} variant="outline">Cancel</Button>
              <Button className="ml-2">Book</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 