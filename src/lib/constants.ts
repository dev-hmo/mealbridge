export const APP_NAME = "MealBridge";
export const APP_DESCRIPTION =
  "Connect food surplus with people who need it. Rescue meals, reduce waste.";

export const LISTING_CATEGORIES = [
  { value: "cooked_meal", label: "Cooked Meal" },
  { value: "raw_ingredients", label: "Raw Ingredients" },
  { value: "bakery", label: "Bakery" },
  { value: "produce", label: "Produce" },
  { value: "packaged", label: "Packaged" },
  { value: "other", label: "Other" },
] as const;

export const QUANTITY_UNITS = [
  { value: "portions", label: "Portions" },
  { value: "kg", label: "Kilograms" },
  { value: "items", label: "Items" },
  { value: "liters", label: "Liters" },
] as const;

export const DIETARY_OPTIONS = [
  { value: "halal", label: "Halal" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "nut_free", label: "Nut Free" },
] as const;

export const LISTING_STATUS_CONFIG = {
  available: { label: "Available", color: "bg-green-100 text-green-800" },
  claimed: { label: "Claimed", color: "bg-yellow-100 text-yellow-800" },
  rescued: { label: "Rescued", color: "bg-blue-100 text-blue-800" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800" },
} as const;

export const CLAIM_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800" },
} as const;

export const ITEMS_PER_PAGE = 12;

export const MAX_PHOTOS_PER_LISTING = 5;

export const PHOTO_BUCKET_NAME = "food-photos";
