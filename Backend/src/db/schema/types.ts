import {pgEnum} from "drizzle-orm/pg-core";

export const types = pgEnum("types",
    [ "Masonry", "Block", "Monolithic", "Wooden", "Log", "Framework", "Other"]
);
