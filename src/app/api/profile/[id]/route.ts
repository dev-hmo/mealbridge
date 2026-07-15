import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/profile/[id] - Fetch a public profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServerClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, neighborhood, city, created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get stats
  const { count: listingsCount } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", id);

  const { count: rescuedCount } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", id)
    .eq("status", "rescued");

  // Get recent listings
  const { data: recentListings } = await supabase
    .from("food_listings")
    .select("id, title, photo_urls, category, status, created_at")
    .eq("vendor_id", id)
    .order("created_at", { ascending: false })
    .limit(6);

  return NextResponse.json({
    profile: data,
    stats: {
      listings: listingsCount || 0,
      rescued: rescuedCount || 0,
    },
    recentListings: recentListings || [],
  });
}
