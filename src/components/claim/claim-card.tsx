"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ClaimActions } from "./claim-actions";
import { timeAgo } from "@/lib/utils";
import type { FoodClaim } from "@/types/database";

const claimStatusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
};

const claimStatusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

interface ClaimCardProps {
  claim: FoodClaim;
  viewType: "made" | "received";
  onStatusChange?: () => void;
  onReview?: () => void;
}

export function ClaimCard({ claim, viewType, onStatusChange, onReview }: ClaimCardProps) {
  const listing = claim.listing as {
    id: string;
    title: string;
    photo_urls: string[];
    pickup_location: string;
    category: string;
    vendor_id: string;
  } | null;

  const claimer = claim.claimer as {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Listing photo */}
          <Link href={`/listing/${listing?.id}`} className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
              {listing?.photo_urls?.[0] ? (
                <img
                  src={listing.photo_urls[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🍽️
                </div>
              )}
            </div>
          </Link>

          {/* Claim info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link
                href={`/listing/${listing?.id}`}
                className="font-semibold text-gray-900 hover:text-green-600 truncate"
              >
                {listing?.title}
              </Link>
              <Badge variant={claimStatusVariant[claim.status] || "default"}>
                {claimStatusLabel[claim.status] || claim.status}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              📍 {listing?.pickup_location}
            </p>

            {viewType === "received" && claimer && (
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={claimer.full_name} src={claimer.avatar_url} size="sm" />
                <span className="text-sm text-gray-700">{claimer.full_name}</span>
              </div>
            )}

            {claim.message && (
              <p className="text-sm text-gray-500 italic mb-2 line-clamp-2">
                &ldquo;{claim.message}&rdquo;
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{timeAgo(claim.created_at)}</span>

              <div className="flex items-center gap-2">
                {/* Review button for completed claims */}
                {claim.status === "completed" && onReview && (
                  <button
                    onClick={onReview}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    ⭐ Leave Review
                  </button>
                )}

                {/* Action buttons */}
                <ClaimActions
                  claim={claim}
                  viewType={viewType}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
