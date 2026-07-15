"use client";

import { ListingForm } from "@/components/listing/listing-form";

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Share Food
        </h1>
        <p className="text-gray-600">
          List surplus food for your community to claim
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <ListingForm mode="create" />
      </div>
    </div>
  );
}
