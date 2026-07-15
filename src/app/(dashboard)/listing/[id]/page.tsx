"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { StatusBadge } from "@/components/listing/status-badge";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUIStore } from "@/stores/use-ui-store";
import { formatDate, formatTime } from "@/lib/utils";
import type { FoodListing } from "@/types/database";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [listing, setListing] = useState<FoodListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        setListing(data.listing);
      } catch {
        addToast("error", "Listing not found");
        router.push("/feed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.id, router, addToast]);

  const handleClaim = async () => {
    if (!user || !listing) return;
    setIsClaiming(true);

    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          message: claimMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to claim");

      addToast("success", "Claim request sent!");
      setShowClaimModal(false);
      setClaimMessage("");
      // Refresh listing status
      const updatedResponse = await fetch(`/api/listings/${listing.id}`);
      const updatedData = await updatedResponse.json();
      setListing(updatedData.listing);
    } catch {
      addToast("error", "Failed to send claim request");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (!listing) return null;

  const vendor = listing.vendor as {
    id: string;
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  } | undefined;
  const isOwner = user?.id === listing.vendor_id;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Photo gallery */}
      <ListingGallery
        photos={listing.photo_urls || []}
        title={listing.title}
      />

      {/* Content */}
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            <StatusBadge status={listing.status} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              {listing.category.replace("_", " ")}
            </Badge>
            {listing.dietary_info?.map((tag) => (
              <Badge key={tag} variant="success">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {listing.quantity}
            </div>
            <div className="text-sm text-gray-600">{listing.quantity_unit}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {listing.servings}
            </div>
            <div className="text-sm text-gray-600">Servings</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-blue-600">
              {formatDate(listing.available_until)}
            </div>
            <div className="text-sm text-gray-600">Expires</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-lg font-bold text-purple-600">
              {formatTime(listing.available_from)}
            </div>
            <div className="text-sm text-gray-600">Ready from</div>
          </div>
        </div>

        {/* Pickup location */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            📍 Pickup Location
          </h2>
          <p className="text-gray-600">{listing.pickup_location}</p>
        </div>

        {/* Vendor info */}
        {vendor && (
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <Avatar name={vendor.full_name} src={vendor.avatar_url} size="lg" />
            <div>
              <div className="font-medium text-gray-900">{vendor.full_name}</div>
              <div className="text-sm text-gray-600">Food donor</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          {isOwner ? (
            <>
              <Button
                variant="secondary"
                onClick={() => router.push(`/listing/${listing.id}/edit`)}
                className="flex-1"
              >
                Edit Listing
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this listing?")) {
                    await fetch(`/api/listings/${listing.id}`, {
                      method: "DELETE",
                    });
                    addToast("success", "Listing deleted");
                    router.push("/my-listings");
                  }
                }}
                className="flex-1"
              >
                Delete
              </Button>
            </>
          ) : listing.status === "available" ? (
            <Button
              onClick={() => setShowClaimModal(true)}
              className="flex-1"
              size="lg"
            >
              Claim This Food
            </Button>
          ) : null}
        </div>
      </div>

      {/* Claim Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Claim This Food"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Send a message to {vendor?.full_name} about picking up this food.
          </p>
          <textarea
            value={claimMessage}
            onChange={(e) => setClaimMessage(e.target.value)}
            placeholder="Hi! I'd like to claim this food. I can pick it up at..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowClaimModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              loading={isClaiming}
              className="flex-1"
            >
              Send Claim Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
