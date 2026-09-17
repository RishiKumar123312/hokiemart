import Link from "next/link";
import { elapsedShort } from "@/lib/time";
import { cn } from "@/lib/utils";
import { MessageAvatar } from "./message-avatar";
import type { Conversation, User } from "@/lib/mock-data";

// One row in the message inbox. Deliberately person-first: it shows who the
// conversation is with, not what listing it's about -- the listing only
// shows up once you're actually inside the conversation, on the reference
// card. Someone scanning their inbox is looking for a person, the way they
// would in any other messaging app.
export function InboxRow({
  conversation,
  otherUser,
}: {
  conversation: Conversation;
  otherUser: User | undefined;
}) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Link
      href={`/messages/${conversation.otherUserId}`}
      className="flex min-h-11 cursor-pointer items-center gap-3 px-5 py-3.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <MessageAvatar initials={otherUser?.initials} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="flex items-center gap-1.5 truncate text-[15px] text-ink">
            {otherUser?.displayName ?? "Unknown"}
            {/* The unread dot is the only thing marking a conversation as
                unread -- there's deliberately no bold text anywhere, so this
                small maroon circle is doing all of that work by itself. */}
            {hasUnread && (
              <span
                aria-label="Unread"
                className="inline-block size-[5px] shrink-0 rounded-full bg-brand"
              />
            )}
          </span>
          {lastMessage && (
            <span className="label-caps shrink-0">{elapsedShort(lastMessage.sentAt)}</span>
          )}
        </div>
        {lastMessage && (
          <p
            className={cn(
              "mt-0.5 truncate text-[12.5px]",
              hasUnread ? "text-[#4A4A4A]" : "text-ink-muted"
            )}
          >
            {lastMessage.body}
          </p>
        )}
      </div>
    </Link>
  );
}
