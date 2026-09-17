"use client";

// The account settings screen -- a grouped list, like a phone's built-in
// settings app. Everything a person chose while signing up (name, username,
// password, whether their phone/email are visible to others) can be changed
// again from here, because sign-up shouldn't be the only chance to get it
// right.

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsRow } from "@/components/settings/settings-row";
import { VisibilityToggle, visibilityHelperText } from "@/components/settings/visibility-toggle";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useStore();

  // Settings only makes sense for a signed-in person. This mirrors the same
  // defensive check already used on the profile page.
  if (!currentUser) {
    return (
      <div>
        <BackHeader title="Settings" backHref="/profile" />
        <p className="px-4 py-6 text-[13px] text-muted-text">You&apos;re not signed in.</p>
      </div>
    );
  }

  const phoneHidden = currentUser.phoneHidden ?? true;
  const emailHidden = currentUser.emailHidden ?? true;

  return (
    <div className="pb-10">
      <BackHeader title="Settings" backHref="/profile" />

      <SettingsSection title="Profile">
        <SettingsRow
          label="Display name"
          value={currentUser.displayName}
          href="/settings/name"
        />
        <SettingsRow
          label="Username"
          value={currentUser.username ? `@${currentUser.username}` : undefined}
          href="/settings/username"
        />
        <SettingsRow label="Profile photo" value="Not set" href="/settings/photo" />
      </SettingsSection>

      <SettingsSection title="Privacy">
        <div>
          <SettingsRow
            label="Phone number"
            right={
              <VisibilityToggle
                label="Phone number"
                hidden={phoneHidden}
                // Takes effect immediately -- there's no separate save step
                // for privacy choices, unlike the "edit" screens above.
                onChange={(hidden) => updateProfile({ phoneHidden: hidden })}
              />
            }
          />
          <p className="px-4 pb-3 text-[12px] text-muted-text">
            {visibilityHelperText("phone", phoneHidden)}
          </p>
        </div>
        <div>
          <SettingsRow
            label="VT email"
            right={
              <VisibilityToggle
                label="VT email"
                hidden={emailHidden}
                onChange={(hidden) => updateProfile({ emailHidden: hidden })}
              />
            }
          />
          <p className="px-4 pb-3 text-[12px] text-muted-text">
            {visibilityHelperText("email", emailHidden)}
          </p>
        </div>
      </SettingsSection>

      <SettingsSection title="Sign-in and security">
        <SettingsRow label="Change password" href="/settings/password" />
        <SettingsRow label="Sign-in methods" href="/settings/sign-in-methods" />
        <SettingsRow label="Signed-in devices" href="/settings/devices" />
      </SettingsSection>

      <SettingsSection title="Account">
        <button
          type="button"
          onClick={() => router.push("/auth/signin")}
          className="flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[13px] text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <LogOut className="size-4 text-stone" />
          Sign out
        </button>
        <SettingsRow label="Delete account" href="/settings/delete" destructive />
      </SettingsSection>
    </div>
  );
}
