"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Determine user role based on the current path
  const userRole = pathname.startsWith("/mentor") ? "mentor" : "student";

  return (
    <DashboardLayout userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
