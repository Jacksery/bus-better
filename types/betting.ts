export interface Bus {
    id: string;
    expectedDeparture: string;
    scheduledDeparture: string;
    routeNumber: string;
}

export interface Bet {
    id: string;
    busId: string;
    routeNumber: string;
    amount: number;
    prediction: 'early' | 'late' | 'ontime';
    placedAt: Date;
    resolved: boolean;
    won?: boolean;
}
