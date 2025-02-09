'use client'

import { Badge } from "./ui/badge"
import { useUserStore } from "../store/userStore"

export function CurrencyDisplay() {
    const { balance, bets } = useUserStore();
    const pendingBets = bets.filter(bet => !bet.resolved);
    const pendingAmount = pendingBets.reduce((sum, bet) => sum + bet.amount, 0);

    return (
        <div className="flex items-center gap-4">
            <div className="text-sm">
                <span className="text-muted-foreground">Balance:</span>{" "}
                <span className="font-medium">£{balance}</span>
            </div>
            {pendingAmount > 0 && (
                <div className="text-sm">
                    <span className="text-muted-foreground">Pending:</span>{" "}
                    <span className="font-medium text-orange-500">£{pendingAmount}</span>
                </div>
            )}
        </div>
    );
}
