import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { RouteNumberGrid } from "./RouteNumberGrid"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button";

export type SortOption = 'lastUpdated' | 'departure' | 'arrival' | 'routeNumber';
export type SortDirection = 'asc' | 'desc';

interface FilterControlsProps {
    onSortChange: (option: SortOption) => void;
    onDirectionChange: (direction: SortDirection) => void;
    selectedSort: SortOption;
    selectedDirection: SortDirection;
    hideUnknown: boolean;
    onHideUnknownChange: (checked: boolean) => void;
    showActiveOnly: boolean;
    onShowActiveOnlyChange: (checked: boolean) => void;
    availableRoutes: string[];
    selectedRoutes: string[];
    onRouteToggle: (route: string) => void;
    totalBuses: number;
    visibleBuses: number;
    activeBuses: number;
    onClearFilters: () => void;  // Add new prop
}

function BusStats({ total, visible, active }: { total: number; visible: number; active: number }) {
    return (
        <div className="flex gap-6 text-sm">
            <div>
                <span className="text-muted-foreground">Total:</span>{" "}
                <span className="font-medium">{total}</span>
            </div>
            <div>
                <span className="text-muted-foreground">Visible:</span>{" "}
                <span className="font-medium">{visible}</span>
            </div>
            <div>
                <span className="text-muted-foreground">Active:</span>{" "}
                <span className="font-medium text-green-500">{active}</span>
            </div>
        </div>
    )
}

export function FilterControls({
    onSortChange,
    onDirectionChange,
    selectedSort,
    selectedDirection,
    hideUnknown,
    onHideUnknownChange,
    showActiveOnly,
    onShowActiveOnlyChange,
    availableRoutes,
    selectedRoutes,
    onRouteToggle,
    totalBuses,
    visibleBuses,
    activeBuses,
    onClearFilters
}: FilterControlsProps) {
    const handleSelectAll = () => {
        availableRoutes.forEach(route => {
            if (!selectedRoutes.includes(route)) {
                onRouteToggle(route);
            }
        });
    };

    const handleClearAll = () => {
        selectedRoutes.forEach(route => {
            onRouteToggle(route);
        });
    };

    return (
        <div className="space-y-6 bg-card p-6 rounded-lg border mb-6">
            {/* Sort Controls */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select value={selectedSort} onValueChange={(value: SortOption) => onSortChange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastUpdated">Last Bus Update</SelectItem>
                            <SelectItem value="departure">Next Departure</SelectItem>
                            <SelectItem value="arrival">Arrival Time</SelectItem>
                            <SelectItem value="routeNumber">Route Number</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Order</label>
                    <Select value={selectedDirection} onValueChange={(value: SortDirection) => onDirectionChange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Order..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5 w-[180px]">
                    <label className="text-sm font-medium block mb-1.5">Routes</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                Select Routes
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">
                                    {selectedRoutes.length}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <RouteNumberGrid
                                routes={availableRoutes}
                                selectedRoutes={selectedRoutes}
                                onRouteToggle={onRouteToggle}
                                onSelectAll={handleSelectAll}
                                onClearAll={handleClearAll}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {/* Checkboxes */}
            <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Display Options</h3>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="hideUnknown"
                            checked={hideUnknown}
                            onCheckedChange={onHideUnknownChange}
                        />
                        <label
                            htmlFor="hideUnknown"
                            className="text-sm cursor-pointer"
                        >
                            Hide buses with unknown times
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="activeOnly"
                            checked={showActiveOnly}
                            onCheckedChange={onShowActiveOnlyChange}
                        />
                        <label
                            htmlFor="activeOnly"
                            className="text-sm cursor-pointer"
                        >
                            Show active buses only
                        </label>
                    </div>
                </div>
            </div>

            {/* Stats and Reset - Now at bottom */}
            <div className="flex justify-between items-center">
                <BusStats total={totalBuses} visible={visibleBuses} active={activeBuses} />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-muted-foreground hover:bg-destructive/10"
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    )
}
