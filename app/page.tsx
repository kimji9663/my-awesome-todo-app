import { redirect } from "next/navigation";
import { TodoApp } from "@/components/todo-app";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return <TodoApp userEmail={session.email} />;
}
