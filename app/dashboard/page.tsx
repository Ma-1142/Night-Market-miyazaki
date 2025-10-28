import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {session.user?.name || session.user?.email}
          </p>
          <p className="text-sm text-gray-500">Role: {session.user?.role}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">User Dashboard</h2>
            <p className="mt-2 text-gray-600">Submit and manage your shop forms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
