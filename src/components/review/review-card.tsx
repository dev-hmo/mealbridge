"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "./star-rating";
import { timeAgo } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  listing: {
    id: string;
    title: string;
  } | null;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const reviewer = review.reviewer;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            name={reviewer?.full_name || "User"}
            src={reviewer?.avatar_url}
            size="md"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 text-sm">
                {reviewer?.full_name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">
                {timeAgo(review.created_at)}
              </span>
            </div>

            <StarRating rating={review.rating} readonly size="sm" />

            {review.listing && (
              <p className="text-xs text-gray-500 mt-1">
                for &ldquo;{review.listing.title}&rdquo;
              </p>
            )}

            {review.comment && (
              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
