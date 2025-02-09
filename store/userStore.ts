import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Bet {
    busId: string;
    routeNumber: string;
    amount: number;
    prediction: 'early' | 'late' | 'ontime';
    placedAt: string;
    resolved: boolean;
    won?: boolean;
}

interface UserStore {
    balance: number;
    bets: Bet[];
    buses: any[];
    placeBet: (bet: Omit<Bet, 'placedAt' | 'resolved' | 'won'>) => void;
    resolveBet: (busId: string, won: boolean) => void;
    clearBets: () => void;
    setBuses: (buses: any[]) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            balance: 100,
            bets: [],
            buses: [],
            setBuses: (buses) => set({ buses }),
            placeBet: (bet) => set((state) => ({
                ...state,
                balance: state.balance - bet.amount,
                bets: [...state.bets, {
                    ...bet,
                    placedAt: new Date().toISOString(),
                    resolved: false,
                }],
            })),
            resolveBet: (busId: string, won: boolean) => set((state) => ({
                ...state,
                balance: won
                    ? state.balance + (state.bets.find(b => b.busId === busId)?.amount ?? 0) * 2
                    : state.balance,
                bets: state.bets.map(bet =>
                    bet.busId === busId && !bet.resolved
                        ? { ...bet, resolved: true, won }
                        : bet
                )
            })),
            clearBets: () => set((state) => ({
                balance: state.balance + state.bets
                    .filter(bet => !bet.resolved)
                    .reduce((sum, bet) => sum + bet.amount, 0),
                bets: []
            }))
        }),
        {
            name: 'user-storage'
        }
    )
);
