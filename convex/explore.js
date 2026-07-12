import { v } from "convex/values";
import { query } from "./_generated/server";

export const getFeaturedEvents = query({
    args:{
        limit: v.optional(v.number()),
    },
    handler: async (ctx,args) =>{
        const now = Date.now();
        
        let events = await ctx.db
        .query("events")
        .withIndex("by_start_date")
        .filter((q)=>q.gte(q.field("startDate"),now))
        .order("desc")
        .collect();

        const featured = events
            .sort((a,b) => b.registrationCount - a.registrationCount)
            .slice(0,args.limit ?? 3);
        
            return featured;
    },
});

// Get events by location
export const getEventsByLocation = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        limit: v.optional(v.number()),
        userInterests: v.optional(v.array(v.string())),
    },
    handler: async (ctx,args) => {
        const now = Date.now();

        let events = await ctx.db.query("events").withIndex("by_start_date").filter((q)=>q.gte(q.field("startDate"),now)).collect();

        if(args.city) {
            events = events.filter(
                (e) => e.city?.toLowerCase() === args.city.toLowerCase()
            )
        }else if(args.state){
            events = events.filter(
                (e) => e.state?.toLowerCase() === args.state.toLowerCase()
            );
        }

        if (args.userInterests && args.userInterests.length > 0) {
            events.sort((a, b) => {
                const aMatches = args.userInterests.includes(a.category) ? 1 : 0;
                const bMatches = args.userInterests.includes(b.category) ? 1 : 0;
                return bMatches - aMatches; // Puts matches (1) before non-matches (0)
            });
        }
        return events.slice(0,args.limit ?? 4);
    }
})

// Get popular events (high registration count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
    userInterests: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Sort by registration count
    events.sort((a, b) => {
        let scoreA = a.registrationCount;
        let scoreB = b.registrationCount;

        if (args.userInterests && args.userInterests.length > 0) {
            if (args.userInterests.includes(a.category)) scoreA += 10000;
            if (args.userInterests.includes(b.category)) scoreB += 10000;
        }

        return scoreB - scoreA;
    });

    return events.slice(0, args.limit ?? 6);
  },
});



// Get events by category with pagination
export const getEventsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    return events.slice(0, args.limit ?? 12);
  },
});

// Get event counts by category
export const getCategoryCounts = query({
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Count events by category
    const counts = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

    return counts;
  },
});