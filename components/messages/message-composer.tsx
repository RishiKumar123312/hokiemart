"use client";

import { useState, type KeyboardEvent } from "react";

// The box at the bottom of a conversation where someone types their next
// message. Deliberately plain -- no border around the input itself, no
// rounded pill shape -- just a line of serif text sitting on the page, with
// a hairline rule above the whole bar to separate it from the messages.
export function MessageComposer({ onSend }: { onSend: (body: string) => void }) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return; // Nothing typed -- pressing Send or Enter does nothing.
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-3 border-t border-rule bg-paper px-5 py-3">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message"
        aria-label="Write a message"
        className="min-w-0 flex-1 border-none bg-transparent font-editorial text-[13.5px] text-ink outline-none placeholder:text-ink-muted"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={value.trim() === ""}
        className="shrink-0 cursor-pointer font-editorial text-[13.5px] text-brand outline-none disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Send
      </button>
    </div>
  );
}
