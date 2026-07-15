export type UserRole = "vendor" | "receiver" | "both";

export type ListingCategory =
  | "cooked_meal"
  | "raw_ingredients"
  | "bakery"
  | "produce"
  | "packaged"
  | "other";

export type QuantityUnit = "portions" | "kg" | "items" | "liters";

export type ListingStatus = "available" | "claimed" | "rescued" | "expired";

export type ClaimStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type NotificationType =
  | "listing_created"
  | "claim_received"
  | "claim_confirmed"
  | "claim_cancelled"
  | "review_received";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  neighborhood: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
  created_at: string;
}

export interface FoodListing {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category: ListingCategory;
  quantity: number;
  quantity_unit: QuantityUnit;
  servings: number;
  dietary_info: string[];
  photo_urls: string[];
  pickup_location: string;
  latitude: number | null;
  longitude: number | null;
  available_from: string;
  available_until: string;
  status: ListingStatus;
  created_at: string;
  // Joined fields
  vendor?: Profile;
}

export interface FoodClaim {
  id: string;
  listing_id: string;
  claimer_id: string;
  quantity_claimed: number;
  status: ClaimStatus;
  pickup_time: string | null;
  message: string | null;
  created_at: string;
  // Joined fields
  listing?: FoodListing;
  claimer?: Profile;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined fields
  reviewer?: Profile;
  reviewee?: Profile;
  listing?: FoodListing;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}
