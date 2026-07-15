"use client";

import { ReviewCard } from "./review-card";

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

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">⭐</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
        <p className="text-gray-600 text-sm">
          Reviews will appear here after completed food rescues.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
