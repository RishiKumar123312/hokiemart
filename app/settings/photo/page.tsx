"use client";

// A placeholder for uploading a profile photo. There is no real file upload
// in this prototype -- this screen just reserves the spot in settings for
// when that feature is built.

import { Camera } from "lucide-react";
import { BackHeader } from "@/components/nav/app-header";
import { Avatar } from "@/components/user/avatar";
import { useStore } from "@/lib/store";

export default function ProfilePhotoPage() {
  const { currentUser } = useStore();

  return (
    <div>
      <BackHeader title="Profile photo" backHref="/settings" />
      <div className="flex flex-col items-center gap-4 px-5 py-10 text-center">
        <Avatar initials={currentUser?.initials ?? "?"} size="lg" />
        <button
          type="button"
          disabled
          className="flex min-h-11 cursor-not-allowed items-center gap-2 rounded-lg border border-input-border px-4 text-[13px] text-muted-text opacity-60"
        >
          <Camera className="size-4" />
          Upload a photo
        </button>
        <p className="text-[12px] text-muted-text">
          Photo upload isn&apos;t available yet -- your initials stand in for now.
        </p>
      </div>
    </div>
  );
}
