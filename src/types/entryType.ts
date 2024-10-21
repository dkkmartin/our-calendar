export type entryType = {
  id: number
  title: string
  notes: string | null
  date: string
  time: string | null
  userId: string
  userName: string
  userImage: string
  createdAt: Date
  notificationDate: string | null
  notificationEnabled: boolean
}
