import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/claims/[id] - Fetch a single claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from("food_claims")
    .select(
      `
      *,
      listing:food_listings!listing_id(id, title, photo_urls, pickup_location, category, vendor_id),
      claimer:profiles!claimer_id(id, full_name, avatar_url, phone)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  return NextResponse.json({ claim: data });
}

// PUT /api/claims/[id] - Update claim status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Fetch the claim with listing info
  const { data: claim } = await supabase
    .from("food_claims")
    .select("*, listing:food_listings!listing_id(vendor_id, title)")
    .eq("id", id)
    .single();

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  const listing = claim.listing as { vendor_id: string; title: string } | null;

  // Permission check: vendor can confirm/cancel, claimer can complete
  const isVendor = listing?.vendor_id === user.id;
  const isClaimer = claim.claimer_id === user.id;

  if (!isVendor && !isClaimer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status } = body;

  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[claim.status]?.includes(status)) {
    return NextResponse.json(
      { error: `Cannot transition from ${claim.status} to ${status}` },
      { status: 400 }
    );
  }

  // Only vendor can confirm/cancel, only claimer can complete
  if (status === "confirmed" && !isVendor) {
    return NextResponse.json(
      { error: "Only the vendor can confirm a claim" },
      { status: 403 }
    );
  }

  if (status === "completed" && !isClaimer) {
    return NextResponse.json(
      { error: "Only the claimer can mark as completed" },
      { status: 403 }
    );
  }

  // Update claim status
  const { data, error } = await supabase
    .from("food_claims")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update listing status based on claim status
  if (status === "confirmed") {
    await supabase
      .from("food_listings")
      .update({ status: "claimed" })
      .eq("id", claim.listing_id);
  } else if (status === "cancelled" || status === "completed") {
    await supabase
      .from("food_listings")
      .update({ status: "available" })
      .eq("id", claim.listing_id);
  }

  if (status === "completed") {
    await supabase
      .from("food_listings")
      .update({ status: "rescued" })
      .eq("id", claim.listing_id);
  }

  // Create notification
  const notificationUserId = isVendor ? claim.claimer_id : listing?.vendor_id;
  const notificationMessage: Record<string, string> = {
    confirmed: `Your claim for "${listing?.title}" has been confirmed!`,
    cancelled: `Your claim for "${listing?.title}" has been cancelled.`,
    completed: `The claim for "${listing?.title}" has been marked as completed!`,
  };

  if (notificationUserId && notificationMessage[status]) {
    await supabase.from("notifications").insert({
      user_id: notificationUserId,
      type: `claim_${status}` as "claim_confirmed" | "claim_cancelled",
      title: `Claim ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: notificationMessage[status],
      link: `/listing/${claim.listing_id}`,
    });
  }

  return NextResponse.json({ claim: data });
}

// DELETE /api/claims/[id] - Cancel/delete a claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: claim } = await supabase
    .from("food_claims")
    .select("claimer_id")
    .eq("id", id)
    .single();

  if (!claim || claim.claimer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("food_claims").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
