import { create } from "zustand"

type currentPickedDateType = {
  date: string
  setDate: (newState: string) => void
}

export const currentPickedDateStore = create<currentPickedDateType>((set) => ({
  date: new Date().toISOString().split("T")[0],
  setDate: (newState: string) => set({ date: newState }),
}))
