import { InviteScreen } from "./invite-screen";

export default async function GroupInvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InviteScreen id={id} />;
}
