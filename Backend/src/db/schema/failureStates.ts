import {pgEnum} from "drizzle-orm/pg-core";

export const failureStates = pgEnum("failure_states",
    ["CREATED", "IN_PROGRESS", "DONE"])