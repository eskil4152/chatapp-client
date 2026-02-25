import { redirect } from "next/navigation";

export default async function Home() {
  const auth = localStorage.getItem("AUTH");

  if (!auth) {
    redirect("/login");
  }

  redirect("/rooms");
}
