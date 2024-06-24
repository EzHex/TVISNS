import {pgEnum} from "drizzle-orm/pg-core";

export const directions = pgEnum("directions",
    [ "None", "North", "East", "South", "West", "NorthEast", "SouthEast", "SouthWest", "NorthWest"]
);