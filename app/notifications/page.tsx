"use client";

// The notifications screen: updates about new listings in a category or
// group the signed-in person specifically asked to hear about (see the
// bell toggle on the category filter pills, and on a group's own feed
// page). Laid out the same way as the message inbox -- a big title, an
// unread-count sentence beneath it, then a list of rows -- but kept in the
// app's normal white/sans-serif style rather than messaging's cream paper
// and serif type.

import { useEffect } from "react";
import { BellOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { unreadNotificationSentence } from "@/lib/time";
import { EmptyState } from "@/components/empty-state";
import { NotificationRow } from "@/components/notifications/notification-row";

export default function NotificationsPage() {
  const { getNotifications, getListing, getGroup, unreadNotificationCount, markNotificationsRead } =
    useStore();
  const notifications = getNotifications();

  // Opening this screen is what counts as "read," the same rule already
  // used for opening a message thread.
  useEffect(() => {
    if (unreadNotificationCount > 0) markNotificationsRead();
  }, [unreadNotificationCount, markNotificationsRead]);

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-20 border-b border-hairline bg-white px-4 pt-6 pb-4">
        <h1 className="text-[22px] font-medium text-brand">Notifications</h1>
        <p className="mt-1 text-xs text-stone">
          {unreadNotificationSentence(unreadNotificationCount)}
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff className="size-6" />}
          title="No notifications yet"
          subtitle="Follow a category or turn on notifications for a group to see updates here."
        />
      ) : (
        <div className="divide-y divide-hairline">
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              listing={getListing(notification.listingId)}
              group={notification.kind === "group" ? getGroup(notification.sourceId) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
