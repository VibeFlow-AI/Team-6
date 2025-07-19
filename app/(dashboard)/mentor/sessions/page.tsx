import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Placeholder types
interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  mentorNotes?: string;
  rejectionReason?: string;
  student: { name: string };
  timeSlot: {
    startTime: string;
    endTime: string;
    sessionSchedule: {
      title: string;
      price: number;
    };
  };
  payment: {
    paymentMethod: string;
    status: string;
    bankSlipImage?: string;
  };
}

export default function MentorSessions() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch mentor bookings (placeholder, to be replaced with real fetch)
  useEffect(() => {
    // TODO: Fetch from /api/sessions/mentor/dashboard or similar
    setBookings([]); // Placeholder
  }, []);

  // Handlers
  const handleVerifyBankTransfer = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowVerifyModal(true);
  };
  const handleApproveSession = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowApproveModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mentor Sessions</h1>
      <div className="mb-10">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No session bookings yet.</p>
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
                      Student: {booking.student.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.timeSlot.startTime).toLocaleString()} - {new Date(booking.timeSlot.endTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="secondary">{booking.status}</Badge>
                    <Badge variant="outline">{booking.paymentStatus}</Badge>
                    {booking.payment.paymentMethod === "BANK_TRANSFER" && booking.payment.status === "PENDING" && (
                      <Button size="sm" onClick={() => handleVerifyBankTransfer(booking)}>
                        Verify Bank Transfer
                      </Button>
                    )}
                    {booking.payment.status === "VERIFIED" && booking.status === "PENDING_MENTOR_APPROVAL" && (
                      <Button size="sm" onClick={() => handleApproveSession(booking)}>
                        Approve/Reject Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Verify Bank Transfer Modal Placeholder */}
      {showVerifyModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Verify Bank Transfer</h3>
            <p>Booking: {selectedBooking.id}</p>
            {/* TODO: Show bank slip image, verification form */}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowVerifyModal(false)} variant="outline">Cancel</Button>
              <Button className="ml-2">Verify</Button>
              <Button className="ml-2" variant="destructive">Reject</Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve/Reject Session Modal Placeholder */}
      {showApproveModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Approve/Reject Session</h3>
            <p>Booking: {selectedBooking.id}</p>
            {/* TODO: Approval/rejection form */}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowApproveModal(false)} variant="outline">Cancel</Button>
              <Button className="ml-2">Approve</Button>
              <Button className="ml-2" variant="destructive">Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 