import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/listings/[id] - Fetch a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServerClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from("food_listings")
    .select("*, vendor:profiles!vendor_id(id, full_name, avatar_url, phone)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing: data });
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServerClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("food_listings")
    .select("vendor_id")
    .eq("id", id)
    .single();

  if (!existing || existing.vendor_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("food_listings")
    .update({
      title: body.title,
      description: body.description,
      category: body.category,
      quantity: body.quantity,
      quantity_unit: body.quantity_unit,
      servings: body.servings,
      dietary_info: body.dietary_info,
      photo_urls: body.photo_urls,
      pickup_location: body.pickup_location,
      latitude: body.latitude,
      longitude: body.longitude,
      available_from: body.available_from,
      available_until: body.available_until,
      status: body.status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseServerClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from("food_listings")
    .select("vendor_id")
    .eq("id", id)
    .single();

  if (!existing || existing.vendor_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("food_listings").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
