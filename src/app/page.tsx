"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatsCounter } from "@/components/shared/stats-counter";

interface PlatformStats {
  totalUsers: number;
  rescuedMeals: number;
  totalServings: number;
}

export default function Home() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    rescuedMeals: 0,
    totalServings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalUsers: data.totalUsers || 0,
            rescuedMeals: data.rescuedMeals || 0,
            totalServings: data.totalServings || 0,
          });
        }
      } catch {
        // Use default zeros
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-2xl font-bold text-green-600">MealBridge</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-green-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="text-8xl mb-8">🍽️</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Rescue Food,
          <br />
          <span className="text-green-600">Feed Community</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          MealBridge connects restaurants, bakeries, and households with surplus food
          to people who need it. Reduce waste. Feed neighbors. Build community.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start Rescuing Food
          </Link>
          <Link
            href="/feed"
            className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Browse Available Food
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
          <StatsCounter
            value={stats.rescuedMeals}
            label="Meals Rescued"
            color="text-green-600"
          />
          <StatsCounter
            value={stats.totalServings}
            label="Servings Given"
            color="text-orange-500"
          />
          <StatsCounter
            value={stats.totalUsers}
            label="Users"
            color="text-blue-500"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Built with ❤️ to reduce food waste
      </footer>
    </div>
  );
}
