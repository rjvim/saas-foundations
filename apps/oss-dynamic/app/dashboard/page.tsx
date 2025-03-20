import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { JsonViewer } from "@/components/ui/json-viewer";

export default async function DashboardPage() {
  const [session, activeSessions, deviceSessions, organization] =
    await Promise.all([
      auth.api.getSession({
        headers: await headers(),
      }),
      auth.api.listSessions({
        headers: await headers(),
      }),
      auth.api.listDeviceSessions({
        headers: await headers(),
      }),
      auth.api.getFullOrganization({
        headers: await headers(),
      }),
    ]).catch((e) => {
      console.log(e);
      throw redirect("/sign-in");
    });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <JsonViewer
          data={session}
          title="Current Session"
          initialExpanded={true}
        />
        <JsonViewer data={activeSessions} title="Active Sessions" />
        <JsonViewer data={deviceSessions} title="Device Sessions" />
        <JsonViewer data={organization} title="Organization" />
      </div>
    </div>
  );
}
