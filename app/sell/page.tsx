import { SellForm } from "./sell-form";

export default async function SellPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  return <SellForm initialGroupId={group ?? null} />;
}
