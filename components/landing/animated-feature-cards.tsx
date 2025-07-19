"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface FeatureCard {
  id: number
  title: string
  description: string
  image: string
  alt: string
}

const featureCards: FeatureCard[] = [
  {
    id: 1,
    title: "Personalized Learning",
    description:
      "We tailor the mentorship experience to fit each student's unique goals, learning style, and pace making every session impactful.",
    image: "/horizontalCards/H1.png",
    alt: "Students collaborating in personalized learning environment",
  },
  {
    id: 2,
    title: "Real Mentors, Real Guidance",
    description:
      "Connect with experienced professionals who provide authentic guidance based on real-world experience and industry expertise.",
    image: "/horizontalCards/H2.png",
    alt: "Professional mentor providing guidance",
  },
  {
    id: 3,
    title: "Growth & Career Readiness",
    description:
      "Develop essential skills and confidence needed to excel in your chosen career path with structured growth programs.",
    image: "/horizontalCards/H3.png",
    alt: "Student climbing stairs representing career growth",
  },
  {
    id: 4,
    title: "Insights-Driven Support",
    description:
      "We don't rely on guesswork. Our mentors use data, progress tracking, and evidence-based approaches to deliver meaningful guidance.",
    image: "/horizontalCards/H4.png",
    alt: "Data analytics and insights dashboard",
  },
]

export function AnimatedFeatureCards() {
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % featureCards.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  // Reorder cards so active card is always first
  const reorderedCards = [featureCards[activeCard], ...featureCards.filter((_, index) => index !== activeCard)]

  return (
    <div className="flex gap-4 h-[350px]">
      {reorderedCards.map((card, displayIndex) => {
        const isActive = displayIndex === 0
        const originalIndex = featureCards.findIndex((c) => c.id === card.id)

        return (
          <div
            key={card.id}
            className={`
              relative overflow-hidden rounded-2xl transition-all duration-700 ease-in-out cursor-pointer h-full
              ${
                isActive
                  ? "flex-[2] bg-white shadow-lg scale-[1.02]"
                  : "flex-1 bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-md hover:scale-[1.01]"
              }
            `}
            style={{
              transitionDelay: isActive ? "0ms" : `${displayIndex * 50}ms`,
            }}
            onClick={() => setActiveCard(originalIndex)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image src={card.image || "/placeholder.svg"} alt={card.alt} fill className="object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 lg:p-6 h-full flex flex-col justify-end text-white">
              <div className={`transition-all duration-500 ${isActive ? "space-y-3" : "space-y-2"}`}>
                <h3
                  className={`font-bold transition-all duration-500 leading-tight ${
                    isActive ? "text-xl lg:text-2xl" : "text-base lg:text-lg"
                  }`}
                >
                  {card.title}
                </h3>

                <p
                  className={`transition-all duration-500 leading-relaxed text-sm lg:text-base ${
                    isActive ? "opacity-100 max-h-24 overflow-hidden" : "opacity-0 max-h-0 overflow-hidden"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </div>

            {/* Hover overlay for non-active cards */}
            {!isActive && (
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            )}

            {/* Active card border glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl border-2  pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
