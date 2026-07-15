"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { truncateText, timeAgo } from "@/lib/utils";
import type { FoodListing } from "@/types/database";

interface ListingCardProps {
  listing: FoodListing;
}

const categoryEmoji: Record<string, string> = {
  cooked_meal: "🍲",
  raw_ingredients: "🥬",
  bakery: "🍞",
  produce: "🍎",
  packaged: "📦",
  other: "🍽️",
};

export function ListingCard({ listing }: ListingCardProps) {
  const vendor = listing.vendor as { full_name: string; avatar_url: string | null } | undefined;

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card hoverable className="h-full">
        {/* Photo */}
        <div className="relative h-48 bg-gray-100">
          {listing.photo_urls && listing.photo_urls.length > 0 ? (
            <img
              src={listing.photo_urls[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {categoryEmoji[listing.category] || "🍽️"}
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default">
              {categoryEmoji[listing.category]}{" "}
              {listing.category.replace("_", " ")}
            </Badge>
          </div>

          {/* Photo count */}
          {listing.photo_urls && listing.photo_urls.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              +{listing.photo_urls.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {truncateText(listing.description, 100)}
          </p>

          {/* Quantity info */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className="font-medium text-green-600">
              {listing.quantity} {listing.quantity_unit}
            </span>
            <span>·</span>
            <span>{listing.servings} servings</span>
          </div>

          {/* Dietary tags */}
          {listing.dietary_info && listing.dietary_info.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.dietary_info.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="success">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Avatar
                name={vendor?.full_name || "User"}
                src={vendor?.avatar_url}
                size="sm"
              />
              <span className="text-xs text-gray-500">
                {timeAgo(listing.created_at)}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              📍 {truncateText(listing.pickup_location, 20)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
