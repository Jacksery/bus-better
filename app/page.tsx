'use client'

import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { getBusData } from "../services/busService"
import { BusCard } from "../components/BusCard"
import { LiveIndicator } from "../components/LiveIndicator"
import { useEffect, useState } from "react"
import { BusData } from "../services/busService"
import { FilterControls, SortOption, SortDirection } from "../components/FilterControls"
import { Pagination } from "../components/Pagination"
import { CurrencyDisplay } from "../components/CurrencyDisplay"

export default function Home() {
  const { toast } = useToast()

  const [buses, setBuses] = useState<BusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hideUnknown, setHideUnknown] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchBuses = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      const data = await getBusData();
      setBuses(data);
    } catch (err) {
      setError('Failed to fetch bus data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBuses(true); // Pass true for initial load
    const interval = setInterval(() => fetchBuses(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRouteClick = (route: string) => {
    if (!selectedRoutes.includes(route)) {
      setSelectedRoutes([route]);
      toast({
        description: `Showing only buses on route ${route}`,
      })
    } else {
      setSelectedRoutes([]);
      toast({
        description: "Showing all bus routes",
      })
    }
  };

  const handleRouteToggle = (route: string) => {
    setSelectedRoutes(prev =>
      prev.includes(route)
        ? prev.filter(r => r !== route)
        : [...prev, route]
    );
  };

  const handleClearFilters = () => {
    setSelectedRoutes([]);
    setSortOption('lastUpdated');
    setSortDirection('desc');
    setHideUnknown(false);
    setShowActiveOnly(false);
  };

  const availableRoutes = [...new Set(buses.map(bus => bus.routeNumber))].sort((a, b) =>
    parseInt(a) - parseInt(b)
  );

  const getValidDate = (dateStr: string | undefined): number => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  const sortBuses = (busesToSort: BusData[]) => {
    return [...busesToSort].sort((a, b) => {
      let comparison = 0;

      switch (sortOption) {
        case 'lastUpdated':
          comparison = getValidDate(a.recordedAt) - getValidDate(b.recordedAt);
          break;
        case 'departure':
          const aDeparture = getValidDate(a.expectedDeparture) || getValidDate(a.scheduledDeparture);
          const bDeparture = getValidDate(b.expectedDeparture) || getValidDate(b.scheduledDeparture);
          comparison = aDeparture - bDeparture;
          break;
        case 'arrival':
          comparison = getValidDate(a.scheduledArrival) - getValidDate(b.scheduledArrival);
          break;
        case 'routeNumber':
          const routeA = parseInt(a.routeNumber) || 0;
          const routeB = parseInt(b.routeNumber) || 0;
          comparison = routeA - routeB;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const hasValidTimes = (bus: BusData): boolean => {
    const departureTime = bus.expectedDeparture || bus.scheduledDeparture;
    return !!(departureTime && !isNaN(new Date(departureTime).getTime()) &&
      bus.scheduledArrival && !isNaN(new Date(bus.scheduledArrival).getTime()));
  };

  const isActiveBus = (bus: BusData): boolean => {
    const now = new Date().getTime();
    const departure = new Date(bus.expectedDeparture || bus.scheduledDeparture).getTime();
    const arrival = new Date(bus.scheduledArrival).getTime();
    return departure <= now && now <= arrival;
  };

  const filteredBuses = sortBuses(
    buses.filter(bus => {
      if (hideUnknown && !hasValidTimes(bus)) return false;
      if (showActiveOnly && !isActiveBus(bus)) return false;
      if (selectedRoutes.length > 0 && !selectedRoutes.includes(bus.routeNumber)) return false;
      return true;
    })
  );

  const stats = {
    total: buses.length,
    visible: filteredBuses.length,
    active: buses.filter(isActiveBus).length
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredBuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBuses = filteredBuses.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, sortDirection, hideUnknown, showActiveOnly, selectedRoutes.length]);

  return (
    <div className="min-h-screen p-4">
      <div className="fixed top-4 right-4 flex items-center gap-4">
        <CurrencyDisplay />
        {!isLoading && !error && <LiveIndicator />}
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Live Bus Tracker</h1>
        </div>

        <FilterControls
          onSortChange={setSortOption}
          onDirectionChange={setSortDirection}
          selectedSort={sortOption}
          selectedDirection={sortDirection}
          hideUnknown={hideUnknown}
          onHideUnknownChange={setHideUnknown}
          showActiveOnly={showActiveOnly}
          onShowActiveOnlyChange={setShowActiveOnly}
          availableRoutes={availableRoutes}
          selectedRoutes={selectedRoutes}
          onRouteToggle={handleRouteToggle}
          totalBuses={stats.total}
          visibleBuses={stats.visible}
          activeBuses={stats.active}
          onClearFilters={handleClearFilters}
        />

        {/* Loading and error states */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bus data...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Bus list with pagination */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredBuses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No buses found</p>
            ) : (
              <>
                {paginatedBuses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    onRouteClick={handleRouteClick}
                  />
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}