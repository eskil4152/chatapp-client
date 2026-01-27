import Link from "next/link";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomsList from "@/src/app/RoomsList";

type Room = {
    id: string;
    name: string;
};

export default async function Home() {
    const auth = (await cookies()).get("AUTH")?.value;
    if (!auth) {
        redirect("/login");
    }

    const res = await fetch ("http://localhost:5050/api/rooms/", {
        method: "get",
        headers: {
            Cookie: `AUTH=${auth}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        redirect("/login");
    }

    const rooms: Room[] = await res.json();
    if (rooms.length < 1) {
        return (
            <div>
                <p>No rooms :(</p>
            </div>
        )
    }

    return <RoomsList rooms={rooms} />
}
