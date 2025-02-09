import { useUserStore } from "@/store/userStore"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { formatDateTime } from "../utils/dateFormat"
import { useToast } from "@/hooks/use-toast"
import React from "react";

function BetStatusIndicator({ currentDelay }: { currentDelay: number | null }) {
    if (currentDelay === null) return null;

    if (Math.abs(currentDelay) < 1) {
        return <Badge variant="outline">On Time</Badge>;
    }
    return currentDelay > 0
        ? <Badge variant="destructive">{currentDelay}m late</Badge>
        : <Badge variant="default">{Math.abs(currentDelay)}m early</Badge>;
}

export function BettingHistory() {
    const { bets, clearBets, buses, resolveBet, balance } = useUserStore();
    const { toast } = useToast();
    const pendingBets = bets.filter(bet => !bet.resolved);
    const resolvedBets = bets.filter(bet => bet.resolved);

    // Add useEffect to check bet statuses
    React.useEffect(() => {
        const checkBets = () => {
            pendingBets.forEach(bet => {
                const bus = buses?.find(b => b.id === bet.busId);
                if (!bus) return;
                
                const delay = getCurrentDelay(bus);
                if (delay === null) return;

                // Check if bus has passed its expected time
                const expectedTime = new Date(bus.expectedDeparture).getTime();
                if (Date.now() > expectedTime) {
                    let won = false;
                    if (bet.prediction === 'early' && delay < 0) won = true;
                    if (bet.prediction === 'late' && delay > 0) won = true;
                    if (bet.prediction === 'ontime' && Math.abs(delay) < 1) won = true;

                    resolveBet(bet.id, won);
                    toast({
                        description: won 
                            ? `You won £${bet.amount * 2} on Route ${bet.routeNumber}!` 
                            : `You lost £${bet.amount} on Route ${bet.routeNumber}`,
                    });
                }
            });
        };

        const interval = setInterval(checkBets, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [pendingBets, buses, resolveBet]);

    const handleClearBets = () => {
        if (confirm('Are you sure you want to clear all bets? Pending bets will be refunded.')) {
            clearBets();
            toast({
                description: "All bets have been cleared and pending bets refunded.",
            });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Betting History</CardTitle>
                {bets.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearBets}
                        className="text-muted-foreground hover:bg-destructive/10"
                    >
                        Clear All
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pending Bets Section */}
                <div>
                    <h3 className="font-medium mb-3 text-orange-500">Pending Bets</h3>
                    <div className="space-y-4">
                        {pendingBets.map((bet, index) => {
                            const bus = buses?.find(b => b.id === bet.busId);
                            const delay = bus ? getCurrentDelay(bus) : null;

                            return (
                                <div key={`pending-${index}`} className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">
                                                Route {bet.routeNumber} - {bet.prediction.toUpperCase()}
                                            </p>
                                            <BetStatusIndicator currentDelay={delay} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(bet.placedAt)}
                                        </p>
                                    </div>
                                    <div className="text-orange-500">£{bet.amount}</div>
                                </div>
                            );
                        })}
                        {pendingBets.length === 0 && (
                            <p className="text-sm text-muted-foreground">No pending bets</p>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Resolved Bets Section */}
                <div>
                    <h3 className="font-medium mb-3">Resolved Bets</h3>
                    <div className="space-y-4">
                        {resolvedBets.map((bet, index) => (
                            <div key={`resolved-${index}`} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        Route {bet.routeNumber} - {bet.prediction.toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(bet.placedAt)}
                                    </p>
                                </div>
                                <div className={bet.won ? "text-green-500" : "text-red-500"}>
                                    {bet.won ? `+£${bet.amount * 2}` : `-£${bet.amount}`}
                                </div>
                            </div>
                        ))}
                        {resolvedBets.length === 0 && (
                            <p className="text-sm text-muted-foreground">No resolved bets yet</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function getCurrentDelay(bus: any): number | null {
    if (!bus.expectedDeparture || !bus.scheduledDeparture) return null;
    const expectedTime = new Date(bus.expectedDeparture).getTime();
    const scheduledTime = new Date(bus.scheduledDeparture).getTime();
    return Math.round((expectedTime - scheduledTime) / (1000 * 60));
}
