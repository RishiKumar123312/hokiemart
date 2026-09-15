import Link from "next/link";
import type { Group } from "@/lib/mock-data";
import { GroupIconTile } from "./group-icon-tile";
import { JoinButton } from "./join-button";

export const POLICY_LABEL: Record<Group["joinPolicy"], string> = {
  open: "open to @vt.edu",
  approval: "approval required",
  invite: "invite only",
};

export function GroupRow({ group }: { group: Group }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={`/groups/${group.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <GroupIconTile iconKey={group.iconKey} />
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{group.name}</p>
          <p className="truncate text-sm text-stone">
            {group.memberCount} members · {POLICY_LABEL[group.joinPolicy]}
          </p>
        </div>
      </Link>
      <JoinButton group={group} />
    </div>
  );
}
