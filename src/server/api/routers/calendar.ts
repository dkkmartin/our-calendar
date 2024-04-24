import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { calendarEvents, partnerships } from "@/server/db/schema";

export const calendarEventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        date: z.string(),
        time: z.string().optional(),
        event: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(calendarEvents).values({
        userId: input.userId,
        date: new Date(input.date),
        time: input.time,
        event: input.event,
        notes: input.notes,
      });
    }),
  getEvents: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get all calendar events for the user
      const userEvents = await ctx.db
        .from(calendarEvents)
        .select()
        .where({ userId: input.userId });

      // Check if the user is in a partnership
      const partnership = await ctx.db
        .from(partnerships)
        .select()
        .where({ user1Id: input.userId })
        .first();

      let partnerEvents = [];
      if (partnership) {
        // If the user is in a partnership, get all calendar events for their partner
        partnerEvents = await ctx.db
          .from(calendarEvents)
          .select()
          .where({ userId: partnership.user2Id });
      }

      // Combine the user's events and their partner's events
      const allEvents = [...userEvents, ...partnerEvents];

      return allEvents;
    }),

  // Add more procedures here as needed
});
