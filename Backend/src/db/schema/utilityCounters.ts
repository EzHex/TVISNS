import {integer, pgTable, real, serial, varchar} from "drizzle-orm/pg-core";
import {counterTypes} from "./counterTypes";
import {relations} from "drizzle-orm/relations";
import {readings} from "./readings";
import {apartments} from "./apartments";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";

export const utilityCounters = pgTable("utility_counters", {
    id: serial("id").notNull().primaryKey(),
    title: varchar("title").notNull(),
    price: real("price").default(0).notNull(),
    counterType: counterTypes("counter_type").notNull(),
    apartmentId: integer("apartment_id").references(() => apartments.id, {onDelete: "cascade"}).notNull(),
})

export const utilityCounterRelations = relations(utilityCounters, ({many}) => ({
   readings: many(readings),
}))

export type UtilityCounter = typeof utilityCounters.$inferSelect;
export type NewUtilityCounter = typeof utilityCounters.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getUtilityCounters = async (apartmentId: number)  => {
    return db
        .select()
        .from(utilityCounters)
        .where(eq(utilityCounters.apartmentId, apartmentId));
}

export const getUtilityCounter = async (id : number) => {
    return db
        .select()
        .from(utilityCounters)
        .where(eq(utilityCounters.id, id))
        .limit(1);
}

export const createUtilityCounter = async (newUtilityCounter: NewUtilityCounter) => {
    if (newUtilityCounter.id) {
        const o = await getUtilityCounter(newUtilityCounter.id);
        if (o[0]) {
            return;
        }
    }

    try {
        return db
            .insert(utilityCounters)
            .values(newUtilityCounter)
            .returning({
                id: utilityCounters.id,
                title: utilityCounters.title,
            })
    } catch {
        console.log("Failed to create utility counter");
    }
}

export const updateUtilityCounter = async (id: number, newUtilityCounter: NewUtilityCounter) => {
    return db
        .update(utilityCounters)
        .set(newUtilityCounter)
        .where(eq(utilityCounters.id, id))
        .returning({
            id: utilityCounters.id,
            title: utilityCounters.title,
        })
}

export const deleteUtilityCounter = async (id: number) => {
    const o = await getUtilityCounter(id);
    if (!o[0]) {
        return;
    }

    return db
        .delete(utilityCounters)
        .where(eq(utilityCounters.id, id))
}