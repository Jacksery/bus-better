import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
    balance: number
    addMoney: (amount: number) => void
    deductMoney: (amount: number) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            balance: 100, // Starting balance
            addMoney: (amount) => set((state) => ({ balance: state.balance + amount })),
            deductMoney: (amount) => set((state) => ({ balance: state.balance - amount })),
        }),
        {
            name: 'user-storage',
        }
    )
)
