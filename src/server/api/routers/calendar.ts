import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { calendarEvents } from "@/server/db/schema";

export const calendarEventRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        date: z.string(),
        time: z.string().optional(),
        event: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(calendarEvents).values({
        date: new Date(input.date),
        time: input.time,
        event: input.event,
        notes: input.notes,
      });
    }),

  // Add more procedures here as needed
});
