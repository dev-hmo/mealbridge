import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/listings - Fetch all listings with optional filters
export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("food_listings")
    .select("*, vendor:profiles!vendor_id(id, full_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  } else {
    // Default: only show available listings on the public feed
    query = query.eq("status", "available");
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data, count });
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("food_listings")
    .insert({
      vendor_id: user.id,
      title: body.title,
      description: body.description,
      category: body.category,
      quantity: body.quantity,
      quantity_unit: body.quantity_unit,
      servings: body.servings,
      dietary_info: body.dietary_info || [],
      photo_urls: body.photo_urls || [],
      pickup_location: body.pickup_location,
      latitude: body.latitude,
      longitude: body.longitude,
      available_from: body.available_from,
      available_until: body.available_until,
      status: "available",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
