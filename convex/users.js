import { AwardIcon } from "lucide-react";
import { mutation, query } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) =>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        const user = await ctx.db.query("users").withIndex("by_token",(q)=> q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        const safeName = identity.name || "Anonymous";
        if(user !== null){
            if(user.name !== safeName){
                await ctx.db.patch(user._id, { name: safeName,
                updatedAt: Date.now(),
                });
            }
            return user._id;
        }

        return await ctx.db.insert("users", {
            name: safeName,
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email ?? "",
            imageUrl: identity.pictureUrl,
            hasCompletedOnboarding: false,
            freeEventsCreated: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});


export const getCurrentUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            return null;
        }

        const user = await ctx.db.query("users").withIndex("by_token",(q)=> q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();

        return user;
    },
})

