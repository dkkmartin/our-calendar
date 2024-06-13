import { create } from "zustand"

type currentPickedDateType = {
  date: Date
  setDate: (newState: Date) => void
}

export const currentPickedDateStore = create<currentPickedDateType>((set) => ({
  date: new Date(),
  setDate: (newState: Date) => set({ date: newState }),
}))
