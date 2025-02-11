"use client";

import { Button } from "@/components/ui/button";
import { BusInfo } from "@/types/bus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useFilter } from "@/contexts/filter-context";
import { cn } from "@/lib/utils";

import { useCallback } from "react";

interface RouteGridProps {
  buses: BusInfo[];
}

export function RouteGrid({ buses }: RouteGridProps) {
  const { selectedRoutes, setSelectedRoutes } = useFilter();

  const uniqueRoutes = Array.from(
    new Set(buses.map((bus) => String(bus.journey.lineRef)))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const handleRouteClick = useCallback(
    (route: string) => {
      setSelectedRoutes((current: string[]) => {
        if (current.includes(route)) {
          return current.filter((r: string) => r !== route);
        } else {
          return [...current, route];
        }
      });
    },
    [setSelectedRoutes]
  );

  const handleSelectAll = () => {
    setSelectedRoutes(uniqueRoutes);
  };

  const handleDeselectAll = () => {
    setSelectedRoutes([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleSelectAll}
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleDeselectAll}
        >
          Clear
        </Button>
      </div>
      <ScrollArea className="h-[200px] w-full">
        <div className="grid grid-cols-4 gap-2 p-1">
          {uniqueRoutes.map((route) => (
            <motion.div
              key={route}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Button
                variant={selectedRoutes.includes(route) ? "default" : "outline"}
                className={cn(
                  "h-10 w-full transition-colors",
                  selectedRoutes.includes(route)
                    ? "hover:bg-primary/80 active:bg-primary/70"
                    : "hover:bg-primary/10 active:bg-primary/20"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleRouteClick(route);
                }}
              >
                {route}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
