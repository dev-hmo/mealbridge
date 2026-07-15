import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/claims - Fetch claims for the current user
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(request.url);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = searchParams.get("type"); // "made" or "received"
  const status = searchParams.get("status");

  let query = supabase
    .from("food_claims")
    .select(
      `
      *,
      listing:food_listings!listing_id(id, title, photo_urls, pickup_location, category, status, vendor_id),
      claimer:profiles!claimer_id(id, full_name, avatar_url)
    `
    )
    .order("created_at", { ascending: false });

  if (type === "made") {
    // Claims I made (as receiver)
    query = query.eq("claimer_id", user.id);
  } else if (type === "received") {
    // Claims on my listings (as vendor)
    // First get my listing IDs
    const { data: myListings } = await supabase
      .from("food_listings")
      .select("id")
      .eq("vendor_id", user.id);

    const listingIds = myListings?.map((l) => l.id) || [];
    if (listingIds.length > 0) {
      query = query.in("listing_id", listingIds);
    } else {
      // No listings, return empty
      return NextResponse.json({ claims: [] });
    }
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ claims: data });
}

// POST /api/claims - Create a new claim
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Check if listing exists and is available
  const { data: listing } = await supabase
    .from("food_listings")
    .select("id, status, vendor_id")
    .eq("id", body.listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.status !== "available") {
    return NextResponse.json(
      { error: "This listing is no longer available" },
      { status: 400 }
    );
  }

  if (listing.vendor_id === user.id) {
    return NextResponse.json(
      { error: "You cannot claim your own listing" },
      { status: 400 }
    );
  }

  // Check if user already claimed this listing
  const { data: existingClaim } = await supabase
    .from("food_claims")
    .select("id")
    .eq("listing_id", body.listing_id)
    .eq("claimer_id", user.id)
    .in("status", ["pending", "confirmed"])
    .single();

  if (existingClaim) {
    return NextResponse.json(
      { error: "You already have an active claim on this listing" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("food_claims")
    .insert({
      listing_id: body.listing_id,
      claimer_id: user.id,
      message: body.message || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create notification for the vendor
  await supabase.from("notifications").insert({
    user_id: listing.vendor_id,
    type: "claim_received",
    title: "New Claim Request",
    message: `Someone wants to claim your food listing!`,
    link: `/listing/${body.listing_id}`,
  });

  return NextResponse.json({ claim: data }, { status: 201 });
}
