"use client";

// One conversation, in full: the header naming who it's with, the messages
// themselves (interleaved with a listing reference card wherever the
// subject changes), and the composer at the bottom for replying.
//
// Threads are per PERSON, not per listing -- see the Conversation type in
// lib/mock-data.ts. That's why a listing is never named in the header the
// way it might be in an app that threads by item: the header is about who
// you're talking to, and the reference cards inside the message flow are
// what say what you're talking about, at whatever point you're talking
// about it.

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { EmptyState } from "@/components/empty-state";
import { MessageBlock } from "@/components/messages/message-block";
import { ListingReferenceCard } from "@/components/messages/listing-reference-card";
import { DayDivider } from "@/components/messages/day-divider";
import { QuickActionChips } from "@/components/messages/quick-action-chips";
import { MessageComposer } from "@/components/messages/message-composer";
import { useStore } from "@/lib/store";
import { groupByDay } from "@/lib/time";

export function MessageThread({ otherUserId }: { otherUserId: string }) {
  const router = useRouter();
  const {
    currentUser,
    listings,
    getConversation,
    getOtherUser,
    getListing,
    sendMessage,
    markConversationRead,
  } = useStore();

  const otherUser = getOtherUser(otherUserId);
  const conversation = getConversation(otherUserId);
  const messages = useMemo(() => conversation?.messages ?? [], [conversation]);

  // Marking the conversation read the moment its thread opens, rather than
  // waiting for any kind of scroll position -- see the plan for why: this
  // prototype never receives a reply after the thread is already open, so
  // there's no real "opened it but didn't get to the bottom" case to worry
  // about getting right.
  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markConversationRead(otherUserId);
    }
  }, [conversation, otherUserId, markConversationRead]);

  // Scrolls to the newest message whenever the conversation grows -- both
  // for a message just sent, and for the very first time the thread opens.
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  if (!otherUser) {
    return (
      <div>
        <div className="flex h-14 items-center border-b border-rule px-2">
          <IconButton aria-label="Back" onClick={() => router.back()}>
            <ArrowLeft className="size-[17px]" />
          </IconButton>
        </div>
        <EmptyState icon={<ArrowLeft className="size-6" />} title="This person isn't around anymore" />
      </div>
    );
  }

  // A stand-in for "where this person is" on the header -- there's no
  // dedicated location field on a user, so this uses the location of
  // whichever of their listings is most recent (listings are already
  // ordered newest-first). If they have no listings at all, the line just
  // shows the verified badge on its own.
  const area = listings.find((l) => l.sellerId === otherUser.id)?.location;
  const subtitle = [otherUser.verified ? "Verified" : null, area].filter(Boolean).join(" · ");

  const dayGroups = groupByDay(messages);

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-rule bg-paper px-2">
        <IconButton aria-label="Back" onClick={() => router.push("/messages")}>
          <ArrowLeft className="size-[17px]" />
        </IconButton>
        <div className="min-w-0 flex-1 pr-11 text-center">
          <p className="truncate text-[16px] text-ink">{otherUser.displayName}</p>
          {subtitle && <p className="label-caps truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex-1 pt-2 pb-4">
        {messages.length === 0 ? (
          <p className="label-caps px-5 py-10 text-center">
            Say hello to start the conversation.
          </p>
        ) : (
          dayGroups.map((day) => (
            <div key={day.label}>
              <DayDivider label={day.label} />
              <div className="space-y-4">
                {day.items.map((message) => {
                  const referencedListing = message.listingId ? getListing(message.listingId) : undefined;
                  return (
                    <div key={message.id}>
                      {referencedListing && (
                        <div className="mb-4">
                          <ListingReferenceCard listing={referencedListing} />
                        </div>
                      )}
                      <MessageBlock
                        senderName={message.senderId === currentUser?.id ? "You" : otherUser.displayName.split(" ")[0]}
                        sentAt={message.sentAt}
                        body={message.body}
                        isOwn={message.senderId === currentUser?.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pinned to the bottom of the screen, the same way the sticky action
          bar on a listing's detail page owns the thumb zone there -- this is
          why the bottom tab bar is hidden on this route (see bottom-nav.tsx). */}
      <div className="sticky bottom-0 z-20 mx-auto w-full max-w-md">
        <QuickActionChips onSend={(text) => sendMessage(otherUserId, text)} />
        <div style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} className="bg-paper">
          <MessageComposer onSend={(body) => sendMessage(otherUserId, body)} />
        </div>
      </div>
    </div>
  );
}
