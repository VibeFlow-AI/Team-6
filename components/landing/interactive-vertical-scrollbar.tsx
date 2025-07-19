"use client";

import type React from "react";

import Image from "next/image";
import { useRef, useState } from "react";

interface ProfileImage {
  id: number;
  src: string;
  alt: string;
  size: "sm" | "md" | "lg" | "xl";
  position: "left" | "center" | "right";
}

const profileImages: ProfileImage[] = [
  {
    id: 1,
    src: "/verticalScrollBar/image1.jpg",
    alt: "Student 1",
    size: "lg",
    position: "right",
  },
  {
    id: 2,
    src: "/verticalScrollBar/image2.jpg",
    alt: "Student 2",
    size: "md",
    position: "left",
  },
  {
    id: 3,
    src: "/verticalScrollBar/image3.jpg",
    alt: "Student 3",
    size: "xl",
    position: "center",
  },
  {
    id: 4,
    src: "/verticalScrollBar/image4.jpg",
    alt: "Student 4",
    size: "sm",
    position: "right",
  },
  {
    id: 5,
    src: "/verticalScrollBar/image5.jpg",
    alt: "Student 5",
    size: "md",
    position: "left",
  },
  {
    id: 6,
    src: "/verticalScrollBar/image6.jpg",
    alt: "Student 6",
    size: "lg",
    position: "center",
  },
  {
    id: 7,
    src: "/verticalScrollBar/image7.jpg",
    alt: "Student 7",
    size: "sm",
    position: "right",
  },
];

const sizeClasses = {
  sm: "w-20 h-40 md:w-40 md:h-[300px]",
  md: "w-20 h-40 md:w-40 md:h-[220px]",
  lg: "w-20 h-40 md:w-40 md:h-[250px]",
  xl: "w-20 h-40 md:w-40 md:h-[300px]",
};

const positionClasses = {
  left: "ml-0 ",
  center: "mx-0",
  right: " mr-0",
};

function ProfileImageItem({ profile }: { profile: ProfileImage }) {
  return (
    <div className="flex flex-col items-center justify-center mb-0">
      <div className={`flex mb-0 md:mb-8 `}>
        <div
          className={`${
            sizeClasses[profile.size]
          } rounded-full overflow-hidden shadow-lg border-3 border-white bg-gradient-to-br from-purple-100 to-blue-100 transition-transform duration-300 hover:scale-105`}
        >
          <Image
            src={profile.src || "/placeholder.svg"}
            alt={profile.alt}
            width={140}
            height={140}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export function InteractiveVerticalScrollbar() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (isHovered && scrollContainerRef.current) {
      e.preventDefault();
      const scrollAmount = e.deltaY * 0.8; // Adjust scroll sensitivity
      scrollContainerRef.current.scrollTop += scrollAmount;
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#D9D9D9] to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#D9D9D9] to-transparent z-10 pointer-events-none" />

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className={`
          w-full h-full overflow-y-auto scrollbar-hide
          transition-all duration-300 ease-in-out flex flex-row         ${
            isHovered ? "cursor-grab active:cursor-grabbing" : ""
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <div className="px-4 py-8">
          {profileImages.map((profile) => (
            <ProfileImageItem key={profile.id} profile={profile} />
          ))}
        </div>
        <div className="px-4 pt-[100px]">
          {[...profileImages].reverse().map((profile) => (
            <ProfileImageItem key={profile.id} profile={profile} />
          ))}
        </div>
        <div className="px-4">
          {profileImages.map((profile) => (
            <ProfileImageItem key={profile.id} profile={profile} />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {/* {isHovered && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
          <div className="w-1 h-20 bg-gray-300 rounded-full opacity-50">
            <div className="w-full h-4 bg-purple-500 rounded-full transition-all duration-300" />
          </div>
        </div>
      )} */}

      {/* Hover hint */}
      <div
        className={`
          absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20
          text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full
          transition-opacity duration-300
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
      >
        Hover & scroll to explore
      </div>
    </div>
  );
}
