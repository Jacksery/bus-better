import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-md">
        <nav className="w-full h-14">
          <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="w-1/3">
              <Skeleton className="h-8 w-[200px]" />
            </div>
            <div className="w-1/3" />
            <div className="w-1/3 flex justify-end items-center gap-4">
              <Skeleton className="h-5 w-24" />{" "}
              {/* Match text-sm font-medium size */}
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </nav>
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pt-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <aside className="order-2 md:order-1">
            <div className="sticky top-[72px] space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="order-1 md:col-span-2 space-y-4 md:order-2">
            <div className="min-h-[500px] space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-14" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-8" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-8" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                      <Skeleton className="h-px w-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-8 flex items-center justify-between sm:justify-center gap-4 w-full">
                <div className="w-[80px]">
                  <Skeleton className="h-10 w-10" />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10" />
                  ))}
                </div>
                <div className="sm:hidden flex-1 text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
                <div className="w-[80px] flex justify-end">
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
