"use client";

// The message inbox: a list of everyone Maya has an open conversation with,
// newest activity first. Rows are person-first on purpose -- see the comment
// on InboxRow for why the listing being discussed is never named here.

import { MailPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { unreadSentence } from "@/lib/time";
import { InboxRow } from "@/components/messages/inbox-row";

export default function MessagesPage() {
  const { getConversations, getOtherUser, totalUnreadCount } = useStore();
  const conversations = getConversations();

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-20 border-b border-rule bg-paper px-5 pt-6 pb-4">
        <h1 className="text-[22px] text-brand">Messages</h1>
        {/* Reads the unread count in words, correctly singular, plural, or
            zero -- see unreadSentence in lib/time.ts. This counts unread
            MESSAGES, not unread conversations. */}
        <p className="label-caps mt-1">{unreadSentence(totalUnreadCount)}</p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <MailPlus className="size-6 text-ink-muted" strokeWidth={1.5} />
          <p className="text-[15px] text-ink">No messages yet</p>
          <p className="label-caps">
            When you message a seller, the conversation shows up here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-rule-soft">
          {conversations.map((conversation) => (
            <InboxRow
              key={conversation.id}
              conversation={conversation}
              otherUser={getOtherUser(conversation.otherUserId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
