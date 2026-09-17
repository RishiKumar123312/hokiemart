import { elapsedShort } from "@/lib/time";
import { cn } from "@/lib/utils";

// A single message, drawn as a ruled block of text rather than a chat
// bubble -- that's the whole point of this screen's look: reading a
// conversation like a letter, not scanning a stack of coloured pills. A thin
// vertical line marks which side of the conversation a message belongs to
// (maroon and on the right for the signed-in person's own messages, a plain
// hairline and on the left for everyone else's), with a small-caps label
// above the text giving who said it and when.
export function MessageBlock({
  senderName,
  sentAt,
  body,
  isOwn,
}: {
  senderName: string;
  sentAt: string;
  body: string;
  isOwn: boolean;
}) {
  return (
    <div
      className={cn(
        "flex px-5",
        // 36px of empty space is kept clear on the opposite side from the
        // rule line, so the column of text never runs the full width of the
        // screen -- that's part of what keeps this feeling like reading
        // prose instead of a wall-to-wall chat log.
        isOwn ? "flex-row-reverse pl-9" : "pr-9"
      )}
    >
      <div className={cn("w-[2px] shrink-0 self-stretch", isOwn ? "bg-brand" : "bg-rule")} />
      <div className={cn("min-w-0 flex-1", isOwn ? "mr-[11px] text-right" : "ml-[11px]")}>
        <p className="label-caps">
          {senderName} · {elapsedShort(sentAt)}
        </p>
        <p className="mt-1 text-[13.5px] leading-[1.65] text-ink">{body}</p>
      </div>
    </div>
  );
}
