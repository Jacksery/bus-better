import { useUserStore } from "@/store/userStore"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { formatDateTime } from "../utils/dateFormat"

export function BettingHistory() {
    const { bets } = useUserStore();
    const pendingBets = bets.filter(bet => !bet.resolved);
    const resolvedBets = bets.filter(bet => bet.resolved);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Betting History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Pending Bets Section */}
                <div>
                    <h3 className="font-medium mb-3 text-orange-500">Pending Bets</h3>
                    <div className="space-y-4">
                        {pendingBets.map((bet, index) => (
                            <div key={`pending-${index}`} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        Route {bet.routeNumber} - {bet.prediction.toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(bet.placedAt)}
                                    </p>
                                </div>
                                <div className="text-orange-500">£{bet.amount}</div>
                            </div>
                        ))}
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
