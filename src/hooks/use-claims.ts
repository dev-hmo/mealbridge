"use client";

import { useState, useEffect, useCallback } from "react";
import type { FoodClaim } from "@/types/database";

interface UseClaimsOptions {
  type?: "made" | "received";
  status?: string;
  autoFetch?: boolean;
}

interface UseClaimsReturn {
  claims: FoodClaim[];
  isLoading: boolean;
  error: string | null;
  fetchClaims: () => Promise<void>;
}

export function useClaims(options: UseClaimsOptions = {}): UseClaimsReturn {
  const { type, status, autoFetch = true } = options;

  const [claims, setClaims] = useState<FoodClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (status) params.set("status", status);

      const response = await fetch(`/api/claims?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }

      const data = await response.json();
      setClaims(data.claims || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [type, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchClaims();
    }
  }, [autoFetch, fetchClaims]);

  return { claims, isLoading, error, fetchClaims };
}
