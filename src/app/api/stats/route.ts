import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/stats - Fetch platform-wide statistics
export async function GET() {
  const supabase = createSupabaseServerClient();

  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Total listings
  const { count: totalListings } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true });

  // Rescued meals (status = rescued)
  const { count: rescuedMeals } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "rescued");

  // Total servings rescued (sum of servings from rescued listings)
  const { data: rescuedData } = await supabase
    .from("food_listings")
    .select("servings")
    .eq("status", "rescued");

  const totalServings = rescuedData?.reduce((sum, item) => sum + (item.servings || 0), 0) || 0;

  // Total claims
  const { count: totalClaims } = await supabase
    .from("food_claims")
    .select("*", { count: "exact", head: true });

  // Completed claims
  const { count: completedClaims } = await supabase
    .from("food_claims")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  // Total reviews
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  // Average rating
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("rating");

  const avgRating =
    reviewData && reviewData.length > 0
      ? reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length
      : 0;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentListings } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  const { count: recentClaims } = await supabase
    .from("food_claims")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // Listings by category
  const { data: categoryData } = await supabase
    .from("food_listings")
    .select("category");

  const categoryCounts: Record<string, number> = {};
  categoryData?.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    totalListings: totalListings || 0,
    rescuedMeals: rescuedMeals || 0,
    totalServings,
    totalClaims: totalClaims || 0,
    completedClaims: completedClaims || 0,
    totalReviews: totalReviews || 0,
    averageRating: Math.round(avgRating * 10) / 10,
    recentActivity: {
      listings: recentListings || 0,
      claims: recentClaims || 0,
    },
    categoryCounts,
  });
}
