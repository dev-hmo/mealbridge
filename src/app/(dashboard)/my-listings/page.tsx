"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUIStore } from "@/stores/use-ui-store";
import type { FoodListing } from "@/types/database";

export default function MyListingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `/api/listings?status=available`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        // Filter to only user's listings
        const myListings = data.listings?.filter(
          (l: FoodListing) => l.vendor_id === user.id
        ) || [];
        setListings(myListings);
      } catch {
        addToast("error", "Failed to load your listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyListings();
  }, [user, addToast]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Listings</h1>
          <p className="text-gray-600">Manage your food listings</p>
        </div>
        <Link href="/listing/new">
          <Button>+ New Listing</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && listings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No listings yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start sharing food with your community!
          </p>
          <Link href="/listing/new">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      )}

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
