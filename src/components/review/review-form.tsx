"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";
import { useUIStore } from "@/stores/use-ui-store";

interface ReviewFormProps {
  claimId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ claimId, onSuccess, onCancel }: ReviewFormProps) {
  const { addToast } = useUIStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      addToast("error", "Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim_id: claimId,
          rating,
          comment: comment || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      addToast("success", "Review submitted! Thank you for your feedback.");
      onSuccess?.();
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How was your experience?
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
      </div>

      <Textarea
        label="Comment (optional)"
        placeholder="Tell others about your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} className="flex-1">
          Submit Review
        </Button>
      </div>
    </form>
  );
}
