"use client";

import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/notification/notification-list";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleMarkOneRead = (id: string) => {
    markAsRead([id]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onRead={handleMarkOneRead}
          />
        )}
      </div>
    </div>
  );
}
