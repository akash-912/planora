import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // users Table

    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(), // Clerk user ID for auth 
        email: v.string(),
        imageUrl: v.optional(v.string()),

        // Onboarding
        hasCompletedOnboarding: v.boolean(),

        location: v.optional(
            v.object({
                city: v.string(),
                state: v.optional(v.string()),
                country: v.string(),
            })
        ),

        interests: v.optional(v.array(v.string())),

        freeEventsCreated: v.number(),
        
        createdAt: v.number(),
        updatedAt: v.number(),


    }).index("by_token",["tokenIdentifier"]),


    
});