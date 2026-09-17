import { MessageThread } from "./message-thread";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <MessageThread otherUserId={userId} />;
}
