"use client";

// A stand-in list of devices currently signed in, plus a button to sign out
// of all of them at once. Nothing here is real -- there is no way, in this
// prototype, to actually know what devices exist.

import { useState } from "react";
import { Laptop, Smartphone } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";

// Pretend devices, just to give the list something to show.
const MOCK_DEVICES = [
  { icon: Smartphone, name: "iPhone -- Blacksburg, VA", detail: "Current session" },
  { icon: Laptop, name: "MacBook Pro -- Blacksburg, VA", detail: "Active 2 days ago" },
];

export default function DevicesPage() {
  const [signedOut, setSignedOut] = useState(false);

  return (
    <div>
      <BackHeader title="Signed-in devices" backHref="/settings" />

      <div className="divide-y divide-hairline border-y border-hairline">
        {MOCK_DEVICES.map((device) => (
          <div key={device.name} className="flex min-h-11 items-center gap-3 px-4 py-3">
            <device.icon className="size-4 shrink-0 text-stone" />
            <div className="min-w-0">
              <p className="truncate text-[13px] text-foreground">{device.name}</p>
              <p className="text-[12px] text-muted-text">{device.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-5">
        <button
          type="button"
          disabled={signedOut}
          onClick={() => setSignedOut(true)}
          className="h-11 w-full cursor-pointer rounded-lg border border-danger text-[13px] font-semibold text-danger outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {signedOut ? "Signed out everywhere" : "Sign out everywhere"}
        </button>
        {signedOut && (
          <p className="mt-2 text-center text-[12px] text-muted-text">
            (Mock only -- nothing was actually signed out.)
          </p>
        )}
      </div>
    </div>
  );
}
