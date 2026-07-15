"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useUIStore } from "@/stores/use-ui-store";
import {
  LISTING_CATEGORIES,
  QUANTITY_UNITS,
  DIETARY_OPTIONS,
} from "@/lib/constants";
import type { FoodListing } from "@/types/database";

interface ListingFormProps {
  initialData?: FoodListing;
  mode: "create" | "edit";
}

export function ListingForm({ initialData, mode }: ListingFormProps) {
  const router = useRouter();
  const { addToast } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [category, setCategory] = useState<string>(initialData?.category || "cooked_meal");
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || "1");
  const [quantityUnit, setQuantityUnit] = useState<string>(initialData?.quantity_unit || "portions");
  const [servings, setServings] = useState(initialData?.servings?.toString() || "1");
  const [dietaryInfo, setDietaryInfo] = useState<string[]>(
    initialData?.dietary_info || []
  );
  const [pickupLocation, setPickupLocation] = useState(
    initialData?.pickup_location || ""
  );
  const [availableFrom, setAvailableFrom] = useState(
    initialData?.available_from?.slice(0, 16) || ""
  );
  const [availableUntil, setAvailableUntil] = useState(
    initialData?.available_until?.slice(0, 16) || ""
  );
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    initialData?.photo_urls || []
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingPhotos.length > 5) {
      addToast("error", "Maximum 5 photos allowed");
      return;
    }
    setPhotos(files);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDietary = (value: string) => {
    setDietaryInfo((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photos.length === 0) return existingPhotos;

    setIsUploading(true);
    const formData = new FormData();
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photos");
      }

      const data = await response.json();
      return [...existingPhotos, ...data.urls];
    } catch {
      addToast("error", "Failed to upload photos");
      return existingPhotos;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();

      const body = {
        title,
        description,
        category,
        quantity: parseInt(quantity),
        quantity_unit: quantityUnit,
        servings: parseInt(servings),
        dietary_info: dietaryInfo,
        photo_urls: photoUrls,
        pickup_location: pickupLocation,
        available_from: availableFrom || new Date().toISOString(),
        available_until: availableUntil || new Date(Date.now() + 86400000).toISOString(),
      };

      const url = mode === "edit" ? `/api/listings/${initialData?.id}` : "/api/listings";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save listing");
      }

      addToast("success", mode === "edit" ? "Listing updated!" : "Listing created!");
      router.push("/my-listings");
    } catch {
      addToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        placeholder="e.g., 20 portions of chicken biryani"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Describe the food, cooking method, freshness, ingredients..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Category & Quantity row */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={LISTING_CATEGORIES}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Select
            label="Unit"
            options={QUANTITY_UNITS}
            value={quantityUnit}
            onChange={(e) => setQuantityUnit(e.target.value)}
          />
        </div>
      </div>

      {/* Servings */}
      <Input
        label="Servings (how many people can eat)"
        type="number"
        min="1"
        value={servings}
        onChange={(e) => setServings(e.target.value)}
        required
      />

      {/* Dietary Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Info
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleDietary(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                dietaryInfo.includes(option.value)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (up to 5)
        </label>

        {/* Existing photos */}
        {existingPhotos.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {existingPhotos.map((photo, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>

      {/* Pickup Location */}
      <Input
        label="Pickup Location"
        placeholder="e.g., 123 Main St, near City Hall"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
        required
      />

      {/* Availability */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Available From"
          type="datetime-local"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
        />
        <Input
          label="Available Until"
          type="datetime-local"
          value={availableUntil}
          onChange={(e) => setAvailableUntil(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          loading={isSubmitting || isUploading}
          className="flex-1"
        >
          {mode === "edit" ? "Update Listing" : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}
