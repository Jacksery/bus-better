import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { FilterCard } from "@/components/filter-card";
import { FilterProvider } from "@/contexts/filter-context";
import { FilteredBusList } from "@/components/filtered-bus-list";
import { Sidebar } from "@/components/sidebar";
import type { BusInfo } from "@/types/bus";

type SearchParams = Promise<{ page?: string }>;

interface PageProps {
  searchParams: SearchParams;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  const { userId } = await auth();
  if (!userId) redirect("/");

  const busResponse = await fetch(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api/bus`,
    { next: { revalidate: 10 } }
  );
  const { buses } = (await busResponse.json()) as { buses: BusInfo[] };

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user.publicMetadata.userCredit) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { userCredit: 1000 },
    });
  }

  return (
    <FilterProvider>
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-md">
          <Navbar
            leftContent={
              <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
                Bus Better
              </h1>
            }
          />
        </div>
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 pt-[72px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <aside className="order-2 md:order-1">
              <Sidebar>
                <FilterCard buses={buses} />
              </Sidebar>
            </aside>
            <div className="order-1 md:col-span-2 space-y-4 md:order-2">
              <FilteredBusList buses={buses} currentPage={currentPage} />
            </div>
          </div>
        </main>
        <MobileSidebar buses={buses} />
      </div>
    </FilterProvider>
  );
}
