import { getAllEntries } from "@/actions"
import { entryType } from "@/types/entryType"
import { format, startOfDay } from "date-fns"
import { create } from "zustand"

type currentPickedDateType = {
  date: string
  setDate: (newState: string) => void
}

export const currentPickedDateStore = create<currentPickedDateType>((set) => ({
  date: format(startOfDay(new Date()), "yyyy-MM-dd"),
  setDate: (newState: string) => set({ date: newState }),
}))

interface EntriesState {
  entries: entryType[]
  eventDates: string[]
  loading: boolean
  fetchEntries: () => Promise<void>
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  eventDates: [],
  loading: false,
  fetchEntries: async () => {
    set({ loading: true })
    try {
      const result = await getAllEntries()
      if (result.success && result.data) {
        const entries = result.data
        const eventDates = entries.map((entry) =>
          new Date(entry.date).toDateString()
        )
        set({ entries, eventDates })
      }
    } catch (err) {
      console.error("Error fetching entries:", err)
    } finally {
      set({ loading: false })
    }
  },
}))
