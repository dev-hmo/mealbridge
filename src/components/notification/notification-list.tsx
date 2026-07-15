"use client";

import { NotificationItem } from "./notification-item";
import type { Notification } from "@/types/database";

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
}

export function NotificationList({ notifications, onRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔔</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No notifications yet
        </h3>
        <p className="text-gray-600">
          You&apos;ll be notified when there&apos;s activity on your listings and claims.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
