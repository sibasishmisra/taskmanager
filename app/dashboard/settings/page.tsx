import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  return <SettingsClient user={session?.user} />;
}
