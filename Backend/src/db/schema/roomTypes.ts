import {pgEnum} from "drizzle-orm/pg-core";

export const roomTypes = pgEnum("roomTypes",
    ["Kitchen", "Living room", "Bedroom", "Bathroom", "Toilet", "Balcony", "Terrace", "Hallway", "Kids room", "Other"])