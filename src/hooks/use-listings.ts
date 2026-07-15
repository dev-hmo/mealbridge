"use client";

import { useState, useEffect, useCallback } from "react";
import type { FoodListing } from "@/types/database";

interface UseListingsOptions {
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  autoFetch?: boolean;
}

interface UseListingsReturn {
  listings: FoodListing[];
  isLoading: boolean;
  error: string | null;
  fetchListings: () => Promise<void>;
}

export function useListings(options: UseListingsOptions = {}): UseListingsReturn {
  const { category, status, search, limit = 12, autoFetch = true } = options;

  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (status && status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      params.set("limit", limit.toString());

      const response = await fetch(`/api/listings?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [category, status, search, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchListings();
    }
  }, [autoFetch, fetchListings]);

  return { listings, isLoading, error, fetchListings };
}
