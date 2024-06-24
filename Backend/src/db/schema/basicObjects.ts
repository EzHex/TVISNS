import {pgEnum} from "drizzle-orm/pg-core";

export const basicObjects = pgEnum("basicObjects",
    ["Table", "Chair", "Sofa", "Bed", "Cupboard", "Wardrobe", "Desk", "TV", "Other"])