"use client";

import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import type { Notification } from "@/types/database";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const typeIcons: Record<string, string> = {
  listing_created: "🍽️",
  claim_received: "🤝",
  claim_confirmed: "✅",
  claim_cancelled: "❌",
  review_received: "⭐",
};

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    // Mark as read
    if (!notification.is_read) {
      onRead(notification.id);
    }

    // Navigate to link if exists
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
        !notification.is_read ? "bg-green-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">
          {typeIcons[notification.type] || "🔔"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {notification.title}
            </span>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>
          <span className="text-xs text-gray-400 mt-1 block">
            {timeAgo(notification.created_at)}
          </span>
        </div>
      </div>
    </button>
  );
}
