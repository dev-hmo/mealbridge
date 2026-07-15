"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { ReviewList } from "@/components/review/review-list";
import { ReviewForm } from "@/components/review/review-form";
import { TrustScore } from "@/components/review/trust-score";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUIStore } from "@/stores/use-ui-store";
import type { Profile } from "@/types/database";

interface ProfileStats {
  listings: number;
  claims: number;
  rescued: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: { id: string; full_name: string; avatar_url: string | null } | null;
  listing: { id: string; title: string } | null;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({ listings: 0, claims: 0, rescued: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ totalReviews: 0, averageRating: 0 });
  const [completedClaimId, setCompletedClaimId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProfile(data.profile);
        setStats(data.stats);

        // Initialize form
        setFullName(data.profile.full_name || "");
        setPhone(data.profile.phone || "");
        setNeighborhood(data.profile.neighborhood || "");
        setCity(data.profile.city || "");

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/reviews?user_id=${data.profile.id}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
          setReviewStats(reviewsData.stats || { totalReviews: 0, averageRating: 0 });
        }
      } catch {
        addToast("error", "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, addToast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          neighborhood,
          city,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
      addToast("success", "Profile updated!");
    } catch {
      addToast("error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.full_name || user?.user_metadata?.full_name || "User"}
              src={profile?.avatar_url}
              size="lg"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.full_name || "User"}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-1">
                <TrustScore
                  averageRating={reviewStats.averageRating}
                  totalReviews={reviewStats.totalReviews}
                  compact
                />
              </div>
            </div>
          </div>

          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
            />
            <Input
              label="Neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g., Downtown, East Side"
            />
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Yangon"
            />

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFullName(profile?.full_name || "");
                  setPhone(profile?.phone || "");
                  setNeighborhood(profile?.neighborhood || "");
                  setCity(profile?.city || "");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={isSaving}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-gray-900">{profile?.phone || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <p className="text-gray-900">
                {profile?.neighborhood && profile?.city
                  ? `${profile.neighborhood}, ${profile.city}`
                  : profile?.city || profile?.neighborhood || "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Member Since</label>
              <p className="text-gray-900">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.listings}</div>
            <div className="text-sm text-gray-600">Listings Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.claims}</div>
            <div className="text-sm text-gray-600">Foods Claimed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{stats.rescued}</div>
            <div className="text-sm text-gray-600">Meals Rescued</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          {reviewStats.totalReviews > 0 && (
            <TrustScore
              averageRating={reviewStats.averageRating}
              totalReviews={reviewStats.totalReviews}
              compact
            />
          )}
        </div>
        <ReviewList reviews={reviews} />
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Leave a Review"
      >
        {completedClaimId && (
          <ReviewForm
            claimId={completedClaimId}
            onSuccess={() => {
              setShowReviewModal(false);
              // Refresh reviews
              if (profile) {
                fetch(`/api/reviews?user_id=${profile.id}`)
                  .then((r) => r.json())
                  .then((data) => {
                    setReviews(data.reviews || []);
                    setReviewStats(data.stats || { totalReviews: 0, averageRating: 0 });
                  });
              }
            }}
            onCancel={() => setShowReviewModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
