import { City, State } from "country-state-city";

export function createLocationSlug(city, state) {
    if (!city || !state) return "";
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    const stateSlug = state.toLowerCase().replace(/\s+/g, "-");
    return `${citySlug}-${stateSlug}`;
}

export function parseLocationSlug(slug) {
    if (!slug || typeof slug !== "string") {
        return { city: null, state: null, isValid: false };
    }

    const indianStates = State.getStatesOfCountry("IN");

    // 1. Loop through all Indian states to see if the slug ends with a valid state name
    for (const state of indianStates) {
        const stateSlug = state.name.toLowerCase().replace(/\s+/g, "-");
        const stateSuffix = `-${stateSlug}`;

        if (slug.endsWith(stateSuffix)) {
            // 2. If we found the state, isolate the city part of the slug
            const citySlug = slug.slice(0, -stateSuffix.length); 
            
            // 3. Look up all cities in that specific state
            const cities = City.getCitiesOfState("IN", state.isoCode);
            
            // 4. Check if any city's slug matches our isolated citySlug
            const matchedCity = cities.find(
                (c) => c.name.toLowerCase().replace(/\s+/g, "-") === citySlug
            );

            // 5. If we found a match, return the properly capitalized names directly from the DB!
            if (matchedCity) {
                return {
                    city: matchedCity.name,
                    state: state.name,
                    isValid: true
                };
            }
        }
    }

    // If no combination matched, it's invalid
    return { city: null, state: null, isValid: false };
}