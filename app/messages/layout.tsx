// Every screen under /messages (the inbox and each conversation thread)
// looks and reads differently from the rest of the app on purpose: a warm
// paper background and a serif typeface, closer to reading a letter than
// scanning a marketplace feed. Browsing is scanning; messaging is reading.
//
// This file is what makes that possible without the look leaking anywhere
// else. Next.js keeps whatever a "layout" file renders wrapped around every
// page inside its folder, so putting the cream background and the serif
// font class here -- rather than repeating them on every individual
// messaging screen -- means it's automatically applied to all of them, and
// it is structurally impossible for a screen outside app/messages/* to pick
// it up by accident, since this file never renders anywhere else.
//
// min-h-full (rather than a fixed height) makes this stretch to fill
// whichever amount of space is actually available -- less than the full
// screen on the inbox, where the bottom tab bar is still showing beneath
// it, and the full screen on a conversation thread, where the tab bar is
// hidden so the message composer can sit at the very bottom instead.
export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full bg-paper font-editorial text-ink">{children}</div>;
}
