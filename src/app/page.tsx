import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomsList from "@/src/app/RoomsList";
import GetRoomsAPI from "@/src/api/GetRoomsAPI";

export default async function Home() {
  const auth = (await cookies()).get("AUTH")?.value;
  if (!auth) {
    redirect("/login");
  }

  redirect("/rooms");
}
