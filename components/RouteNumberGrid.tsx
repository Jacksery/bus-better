import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { useState } from "react"

interface RouteNumberGridProps {
    routes: string[];
    selectedRoutes: string[];
    onRouteToggle: (route: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

function getNumericPart(route: string): number {
    const numericPart = route.match(/\d+/);
    return numericPart ? parseInt(numericPart[0]) : 0;
}

export function RouteNumberGrid({
    routes,
    selectedRoutes,
    onRouteToggle,
    onSelectAll,
    onClearAll
}: RouteNumberGridProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const sortedAndFilteredRoutes = routes
        .sort((a, b) => {
            const aNum = getNumericPart(a);
            const bNum = getNumericPart(b);
            return aNum - bNum;
        })
        .filter(route => route.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-4 space-y-3 w-[300px] ">
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelectAll}
                    className="flex-1"
                >
                    Select All
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearAll}
                    className="flex-1"
                >
                    Clear All
                </Button>
            </div>

            <Input
                type="search"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
            />

            <ScrollArea className="h-[240px]">
                <div className="grid grid-cols-5 gap-1 pr-4">
                    {sortedAndFilteredRoutes.map((route) => (
                        <Button
                            key={route}
                            variant={selectedRoutes.includes(route) ? "default" : "outline"}
                            className="aspect-square h-10 p-0 text-sm"
                            onClick={() => onRouteToggle(route)}
                        >
                            {route}
                        </Button>
                    ))}
                </div>
                <div className="h-2" /> {/* Add bottom padding */}
            </ScrollArea>
        </div>
    )
}
