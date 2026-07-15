"use client";

import { StarRating } from "./star-rating";

interface TrustScoreProps {
  averageRating: number;
  totalReviews: number;
  compact?: boolean;
}

export function TrustScore({
  averageRating,
  totalReviews,
  compact = false,
}: TrustScoreProps) {
  if (totalReviews === 0) {
    return (
      <div className={`text-gray-500 ${compact ? "text-sm" : ""}`}>
        No reviews yet
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StarRating rating={Math.round(averageRating)} readonly size="sm" />
        <span className="text-sm font-medium text-gray-700">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">
          ({totalReviews} review{totalReviews > 1 ? "s" : ""})
        </span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-gray-900 mb-1">
        {averageRating.toFixed(1)}
      </div>
      <StarRating rating={Math.round(averageRating)} readonly size="md" />
      <div className="text-sm text-gray-500 mt-2">
        Based on {totalReviews} review{totalReviews > 1 ? "s" : ""}
      </div>
    </div>
  );
}
