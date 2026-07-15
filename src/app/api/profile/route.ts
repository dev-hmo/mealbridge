import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/profile - Fetch current user's profile
export async function GET() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also get stats
  const { count: listingsCount } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", user.id);

  const { count: claimsCount } = await supabase
    .from("food_claims")
    .select("*", { count: "exact", head: true })
    .eq("claimer_id", user.id);

  const { count: rescuedCount } = await supabase
    .from("food_listings")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", user.id)
    .eq("status", "rescued");

  return NextResponse.json({
    profile: data,
    stats: {
      listings: listingsCount || 0,
      claims: claimsCount || 0,
      rescued: rescuedCount || 0,
    },
  });
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: body.full_name,
      phone: body.phone,
      neighborhood: body.neighborhood,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
