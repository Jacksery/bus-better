import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Bet {
    busId: string;
    amount: number;
    prediction: 'early' | 'late';
    placedAt: string;
    routeNumber: string;
    resolved?: boolean;
    won?: boolean;
}

interface UserState {
    balance: number;
    bets: Bet[];
    addMoney: (amount: number) => void;
    deductMoney: (amount: number) => void;
    placeBet: (bet: Omit<Bet, 'placedAt'>) => void;
    resolveBet: (busId: string, won: boolean) => void;
    clearBets: () => void;
    buses?: any[];
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            balance: 100,
            bets: [],
            addMoney: (amount) => set((state) => ({ balance: state.balance + amount })),
            deductMoney: (amount) => set((state) => ({ balance: state.balance - amount })),
            placeBet: (bet) => set((state) => ({
                balance: state.balance - bet.amount,
                bets: [...state.bets, { ...bet, placedAt: new Date().toISOString() }]
            })),
            resolveBet: (busId, won) => set((state) => {
                console.log('Resolving bet:', { busId, won }); // Add debug log
                return {
                    bets: state.bets.map(bet =>
                        bet.busId === busId
                            ? { ...bet, resolved: true, won }
                            : bet
                    ),
                    balance: won
                        ? state.balance + (state.bets.find(b => b.busId === busId)?.amount ?? 0) * 2
                        : state.balance
                }
            }),
            clearBets: () => set((state) => ({
                bets: [],
                // Return any pending bet amounts to balance
                balance: state.balance + state.bets
                    .filter(bet => !bet.resolved)
                    .reduce((sum, bet) => sum + bet.amount, 0)
            })),
            buses: [],
        }),
        {
            name: 'user-storage',
        }
    )
)
