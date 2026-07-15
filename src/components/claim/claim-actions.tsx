"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/use-ui-store";
import type { FoodClaim } from "@/types/database";

interface ClaimActionsProps {
  claim: FoodClaim;
  viewType: "made" | "received";
  onStatusChange?: () => void;
}

export function ClaimActions({ claim, viewType, onStatusChange }: ClaimActionsProps) {
  const { addToast } = useUIStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/claims/${claim.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update");
      }

      addToast("success", `Claim ${status}!`);
      onStatusChange?.();
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  };

  // Vendor view: can confirm or cancel pending claims
  if (viewType === "received" && claim.status === "pending") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => updateStatus("confirmed")}
          disabled={isUpdating}
        >
          Confirm
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => updateStatus("cancelled")}
          disabled={isUpdating}
        >
          Decline
        </Button>
      </div>
    );
  }

  // Vendor view: can cancel confirmed claims
  if (viewType === "received" && claim.status === "confirmed") {
    return (
      <Button
        size="sm"
        variant="danger"
        onClick={() => updateStatus("cancelled")}
        disabled={isUpdating}
      >
        Cancel
      </Button>
    );
  }

  // Receiver view: can mark confirmed claims as completed
  if (viewType === "made" && claim.status === "confirmed") {
    return (
      <Button
        size="sm"
        onClick={() => updateStatus("completed")}
        disabled={isUpdating}
      >
        Mark Complete
      </Button>
    );
  }

  // No actions for completed or cancelled
  return null;
}
