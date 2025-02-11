"use client";

import { BusInfo } from "@/types/bus";
import { BusList } from "./bus-list";
import { useFilter } from "@/contexts/filter-context";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;
const MAX_VISIBLE_PAGES = 5;

interface FilteredBusListProps {
  buses: BusInfo[];
  currentPage: number;
}

export function FilteredBusList({ buses, currentPage }: FilteredBusListProps) {
  const { selectedRoutes, active } = useFilter();
  const [filteredBuses, setFilteredBuses] = useState<BusInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const now = new Date();
    const filtered = buses.filter((bus) => {
      const matchesRoutes =
        selectedRoutes.length === 0 ||
        selectedRoutes.some(
          (route) =>
            String(bus.journey.lineRef).toLowerCase() === route.toLowerCase()
        );

      const isActive =
        !active ||
        (() => {
          const departureTime = new Date(bus.journey.aimedDeparture);
          const arrivalTime = new Date(bus.journey.aimedArrival);
          return departureTime <= now && arrivalTime > now;
        })();

      return matchesRoutes && isActive;
    });

    filtered.sort((a, b) => {
      const aTime = new Date(a.journey.aimedArrival);
      const bTime = new Date(b.journey.aimedArrival);
      return aTime.getTime() - bTime.getTime();
    });

    setFilteredBuses(filtered);
    setIsLoading(false);
  }, [buses, selectedRoutes, active]);

  const totalPages = Math.ceil(filteredBuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBuses = filteredBuses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getVisiblePages = (current: number, total: number) => {
    if (total <= MAX_VISIBLE_PAGES)
      return Array.from({ length: total }, (_, i) => i + 1);

    if (current <= 3) return [1, 2, 3, 4, "...", total];
    if (current >= total - 2)
      return [1, "...", total - 3, total - 2, total - 1, total];

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (isLoading) {
    return <div className="min-h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="min-h-[500px] flex flex-col">
        {filteredBuses.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                No buses found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <BusList buses={paginatedBuses} />
        )}
      </div>
      {filteredBuses.length > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <div className="flex items-center justify-between sm:justify-center gap-4 w-full">
              <div className="w-[80px]">
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${currentPage - 1}`}
                    className={
                      currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {visiblePages.map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "..." ? (
                      <span className="px-4 py-2">...</span>
                    ) : (
                      <PaginationLink
                        href={`?page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>
              <div className="sm:hidden flex-1 text-center">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <div className="w-[80px] flex justify-end">
                <PaginationItem>
                  <PaginationNext
                    href={`?page=${currentPage + 1}`}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </div>
            </div>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
