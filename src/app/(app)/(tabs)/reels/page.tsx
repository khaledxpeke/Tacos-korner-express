import { ReelsClient } from "./ReelsClient";

export const metadata = { title: "Reels · Takos Korner" };

export default async function ReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  return <ReelsClient startId={start ? Number(start) : undefined} />;
}
