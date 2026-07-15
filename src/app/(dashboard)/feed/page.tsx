"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { ListingFilters } from "@/components/listing/listing-filters";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { ImpactDashboard } from "@/components/shared/impact-dashboard";
import { useListings } from "@/hooks/use-listings";

export default function FeedPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showImpact, setShowImpact] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timer);
  }, []);

  const { listings, isLoading, error } = useListings({
    category: category !== "all" ? category : undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <div>
      {/* Impact Banner */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Community Impact
            </h1>
            <p className="text-gray-600">
              See how MealBridge is making a difference
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImpact(!showImpact)}
          >
            {showImpact ? "Hide" : "Show"} Stats
          </Button>
        </div>

        {showImpact && <ImpactDashboard />}
      </div>

      {/* Listings Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Available Food</h2>
            <p className="text-gray-600 text-sm">
              Browse food listings from vendors in your area
            </p>
          </div>
          <Link href="/listing/new">
            <Button>+ Share Food</Button>
          </Link>
        </div>

        <ListingFilters
          category={category}
          search={search}
          onCategoryChange={setCategory}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && listings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No food listings yet
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to share food with your community!
          </p>
          <Link href="/listing/new">
            <Button>Share Food Now</Button>
          </Link>
        </div>
      )}

      {/* Listings grid */}
      {!isLoading && listings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
