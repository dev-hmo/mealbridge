"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ListingForm } from "@/components/listing/listing-form";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUIStore } from "@/stores/use-ui-store";
import type { FoodListing } from "@/types/database";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();

        // Verify ownership
        if (data.listing.vendor_id !== user?.id) {
          addToast("error", "You can only edit your own listings");
          router.push("/feed");
          return;
        }

        setListing(data.listing);
      } catch {
        addToast("error", "Listing not found");
        router.push("/feed");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchListing();
    }
  }, [params.id, user, router, addToast]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Edit Listing
        </h1>
        <p className="text-gray-600">
          Update your food listing details
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <ListingForm mode="edit" initialData={listing} />
      </div>
    </div>
  );
}
