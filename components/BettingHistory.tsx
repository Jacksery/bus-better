import { useUserStore } from "@/store/userStore"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { formatDateTime } from "../utils/dateFormat"

export function BettingHistory() {
    const { bets } = useUserStore();
    const resolvedBets = bets.filter(bet => bet.resolved);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Betting History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {resolvedBets.map((bet, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Route {bet.routeNumber} - {bet.prediction.toUpperCase()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDateTime(bet.placedAt)}
                                </p>
                            </div>
                            <div className={bet.won ? "text-green-500" : "text-red-500"}>
                                {bet.won ? `+£${bet.amount}` : `-£${bet.amount}`}
                            </div>
                        </div>
                    ))}
                    {resolvedBets.length === 0 && (
                        <p className="text-sm text-muted-foreground">No resolved bets yet</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
