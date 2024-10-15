import { z } from "zod"

export const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must contain at least 1 character",
  }),
  notes: z.string().optional(),
  time: z.string().optional(),
  date: z.date(),
})
