import { Badge } from "@/components/ui/badge";
import type { ListingStatus } from "@/types/database";

interface StatusBadgeProps {
  status: ListingStatus;
}

const statusConfig: Record<ListingStatus, { label: string; variant: "available" | "claimed" | "rescued" | "expired" }> = {
  available: { label: "Available", variant: "available" },
  claimed: { label: "Claimed", variant: "claimed" },
  rescued: { label: "Rescued", variant: "rescued" },
  expired: { label: "Expired", variant: "expired" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.available;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
