"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RouteGrid } from "./route-grid";
import { BusInfo } from "@/types/bus";
import { useFilter } from "@/contexts/filter-context";

interface FilterCardProps {
  buses: BusInfo[];
}

export function FilterCard({ buses }: FilterCardProps) {
  const { active, setActive } = useFilter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Buses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Route Number</Label>
          <RouteGrid buses={buses} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="active">Show Active Only</Label>
          <Switch id="active" checked={active} onCheckedChange={setActive} />
        </div>
      </CardContent>
    </Card>
  );
}
