import type { ReactNode } from "react";

// A labelled group of settings rows -- "Profile", "Privacy", and so on. This
// is the small grey heading plus the hairline-divided block of rows under
// it, matching the grouped look of a phone's built-in settings app.
export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-4">
      {/* Sentence case, not ALL CAPS, per the app's house style. */}
      <h2 className="px-4 pb-1.5 text-[12px] text-muted-text">{title}</h2>
      <div className="divide-y divide-hairline border-y border-hairline">{children}</div>
    </div>
  );
}
