"use client";

import { useState, useEffect } from "react";
import { StatsCounter } from "./stats-counter";
import { ImpactChart } from "./impact-chart";

interface PlatformStats {
  totalUsers: number;
  totalListings: number;
  rescuedMeals: number;
  totalServings: number;
  totalClaims: number;
  completedClaims: number;
  totalReviews: number;
  averageRating: number;
  recentActivity: {
    listings: number;
    claims: number;
  };
  categoryCounts: Record<string, number>;
}

const categoryLabels: Record<string, string> = {
  cooked_meal: "Cooked Meals",
  raw_ingredients: "Raw Ingredients",
  bakery: "Bakery",
  produce: "Produce",
  packaged: "Packaged",
  other: "Other",
};

export function ImpactDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const categoryData = Object.entries(stats.categoryCounts).map(
    ([key, value]) => ({
      label: categoryLabels[key] || key,
      value,
    })
  );

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
          label="Community Members"
          color="text-blue-600"
        />
        <StatsCounter
          value={stats.completedClaims}
          label="Successful Pickups"
          color="text-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalListings}
          </div>
          <div className="text-sm text-gray-600">Total Listings</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalClaims}
          </div>
          <div className="text-sm text-gray-600">Total Claims</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">
            ⭐ {stats.averageRating}
          </div>
          <div className="text-sm text-gray-600">
            {stats.totalReviews} Reviews
          </div>
        </div>
      </div>

      {/* Charts */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <ImpactChart data={categoryData} title="Listings by Category" />
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Last 7 Days
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.recentActivity.listings}
            </div>
            <div className="text-sm text-gray-600">New Listings</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.recentActivity.claims}
            </div>
            <div className="text-sm text-gray-600">Claims Made</div>
          </div>
        </div>
      </div>
    </div>
  );
}
