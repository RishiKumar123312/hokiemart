import { GroupFeed } from "./group-feed";

export default async function GroupFeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupFeed id={id} />;
}
