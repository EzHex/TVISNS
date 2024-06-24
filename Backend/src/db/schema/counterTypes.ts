import {pgEnum} from "drizzle-orm/pg-core";

export const counterTypes = pgEnum("counter_types",
    ["electricity", "electricityNight", "gas", "coldWater", "hotWater"]);

