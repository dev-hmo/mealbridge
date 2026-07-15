"use client";

import { useState } from "react";
import { ClaimCard } from "@/components/claim/claim-card";
import { Modal } from "@/components/ui/modal";
import { ReviewForm } from "@/components/review/review-form";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useClaims } from "@/hooks/use-claims";

type ClaimTab = "made" | "received";

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState<ClaimTab>("made");
  const [reviewClaimId, setReviewClaimId] = useState<string | null>(null);

  const {
    claims: madeClaims,
    isLoading: isLoadingMade,
    fetchClaims: fetchMade,
  } = useClaims({ type: "made" });

  const {
    claims: receivedClaims,
    isLoading: isLoadingReceived,
    fetchClaims: fetchReceived,
  } = useClaims({ type: "received" });

  const claims = activeTab === "made" ? madeClaims : receivedClaims;
  const isLoading = activeTab === "made" ? isLoadingMade : isLoadingReceived;
  const refetch = activeTab === "made" ? fetchMade : fetchReceived;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Claims</h1>
        <p className="text-gray-600">Track your food claims and pickup status</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab("made")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "made"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Claims I Made
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "received"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Claims on My Listings
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && claims.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === "made"
              ? "No claims yet"
              : "No claims on your listings"}
          </h2>
          <p className="text-gray-600">
            {activeTab === "made"
              ? "Browse available food and claim what you need!"
              : "When someone claims your food, it will appear here."}
          </p>
        </div>
      )}

      {/* Claims list */}
      {!isLoading && claims.length > 0 && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              viewType={activeTab}
              onStatusChange={refetch}
              onReview={
                claim.status === "completed" && activeTab === "made"
                  ? () => setReviewClaimId(claim.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewClaimId}
        onClose={() => setReviewClaimId(null)}
        title="Leave a Review"
      >
        {reviewClaimId && (
          <ReviewForm
            claimId={reviewClaimId}
            onSuccess={() => {
              setReviewClaimId(null);
              refetch();
            }}
            onCancel={() => setReviewClaimId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
