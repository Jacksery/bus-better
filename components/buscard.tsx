import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusInfo } from "@/types/bus";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface BusCardProps {
  bus: BusInfo;
}

export default function BusCard({ bus }: BusCardProps) {
  const arrivalTime = new Date(bus.journey.aimedArrival);
  const departureTime = new Date(bus.journey.aimedDeparture);
  const recordedAt = new Date(bus.recordedAt);
  const now = new Date();

  const isActive = departureTime <= now && arrivalTime > now;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-14 h-10 rounded-md flex items-center justify-center",
                isActive ? "bg-green-600" : "bg-red-600"
              )}
            >
              <span className="text-lg font-semibold text-white">
                {bus.journey.lineRef}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {bus.journey.operator}
              </span>
              <span className="text-xs text-muted-foreground">
                Direction: {bus.journey.direction}
              </span>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-sm text-muted-foreground">
                Updated {formatDistanceToNow(recordedAt, { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>{recordedAt.toLocaleString()}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">From</span>
              <p className="font-medium">
                {bus.journey.origin.replace(/_/g, " ")}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">To</span>
              <p className="font-medium">
                {bus.journey.destination.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Departure</span>
              <p className="font-medium">{departureTime.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Arrival</span>
              <p className="font-medium">{arrivalTime.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Bus ID: {bus.journey.vehicleRef}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
