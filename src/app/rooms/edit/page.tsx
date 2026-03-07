import EditRoomPageClient from "./EditRoomPageClient";

export default function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return <EditRoomPageClient roomId={searchParams.id ?? null} />;
}
