import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/reviews - Fetch reviews for a user
export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      reviewer:profiles!reviewer_id(id, full_name, avatar_url),
      listing:food_listings!listing_id(id, title)
    `
    )
    .eq("reviewee_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Calculate average rating
  const avgRating =
    data.length > 0
      ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
      : 0;

  return NextResponse.json({
    reviews: data,
    stats: {
      totalReviews: data.length,
      averageRating: Math.round(avgRating * 10) / 10,
    },
  });
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate rating
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  // Check if claim exists and is completed
  const { data: claim } = await supabase
    .from("food_claims")
    .select("id, listing_id, status")
    .eq("id", body.claim_id)
    .single();

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (claim.status !== "completed") {
    return NextResponse.json(
      { error: "Can only review completed claims" },
      { status: 400 }
    );
  }

  // Get listing to find vendor
  const { data: listing } = await supabase
    .from("food_listings")
    .select("vendor_id")
    .eq("id", claim.listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("listing_id", claim.listing_id)
    .eq("reviewer_id", user.id)
    .single();

  if (existingReview) {
    return NextResponse.json(
      { error: "You already reviewed this listing" },
      { status: 400 }
    );
  }

  // Create review
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      listing_id: claim.listing_id,
      reviewer_id: user.id,
      reviewee_id: listing.vendor_id,
      rating: body.rating,
      comment: body.comment || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create notification for vendor
  await supabase.from("notifications").insert({
    user_id: listing.vendor_id,
    type: "review_received",
    title: "New Review",
    message: `You received a ${body.rating}-star review!`,
    link: `/profile`,
  });

  return NextResponse.json({ review: data }, { status: 201 });
}
