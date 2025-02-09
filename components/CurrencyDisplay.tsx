'use client'

import { Badge } from "./ui/badge"
import { useUserStore } from "../store/userStore"

export function CurrencyDisplay() {
    const balance = useUserStore((state) => state.balance)

    return (
        <Badge variant="secondary">
            Credit: £{balance.toFixed(2)}
        </Badge>
    )
}
