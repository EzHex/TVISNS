import {date, integer, pgTable, real, serial} from "drizzle-orm/pg-core";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";
import {utilityCounters} from "./utilityCounters";

export const readings = pgTable("readings", {
    id: serial("id").notNull().primaryKey(),
    createDate: date("create_date").notNull(),
    value: real("value").notNull(),
    counterId: integer("counter_id").references(() => utilityCounters.id, {onDelete: "cascade"}).notNull(),
})

export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getReadings = async (counterId: number)  => {
    return db
        .select()
        .from(readings)
        .where(eq(readings.counterId, counterId));
}

export const getReading = async (id : number) => {
    return db
        .select()
        .from(readings)
        .where(eq(readings.id, id))
        .limit(1);

}

export const createReading = async (newReading: NewReading) => {
    if (newReading.id) {
        const o = await getReading(newReading.id);
        if (o[0]) {
            return;
        }
    }

    try {
        return db
            .insert(readings)
            .values(newReading)
            .returning({
                id: readings.id,
                date: readings.createDate,
                value: readings.value,
            })
    } catch {
        console.log("Failed to create reading");
    }
}

export const deleteReading = async (id: number) => {
    const r = await getReading(id);
    if (!r[0]) {
        return;
    }

    return db
        .delete(readings)
        .where(eq(readings.id, id))
}