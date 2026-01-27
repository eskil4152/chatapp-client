import Link from "next/link";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const auth = (await cookies()).get("AUTH")?.value;

    if (!auth) {
        redirect("/login");
    }

  return (
    <div>
          <p>Nice, you&#39;re logged in!</p>
    </div>
  );
}
