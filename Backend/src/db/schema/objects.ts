import {integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {rooms} from "./rooms";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import "dotenv/config";
import {eq} from "drizzle-orm";

export const objects = pgTable("objects", {
   id: serial("id").notNull().primaryKey(),
   title: varchar("title", {length: 255}).notNull(),
   description: text("description").notNull(),
   image: varchar("image", {length: 255}).notNull(),
   grade: integer("grade").notNull(),
   ownerId: integer("owner_id").notNull(),
   roomId: integer("room_id").references(() => rooms.id, {onDelete: "cascade"}).notNull(),
});

export type Object = typeof objects.$inferSelect;
export type NewObject = typeof objects.$inferInsert;

const pool = new Pool({
   host: process.env.DB_HOST ?? 'localhost',
   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
   user: process.env.DB_USER ?? 'postgres',
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getObjects = async (roomId: number)  => {
   return db
       .select()
       .from(objects)
       .where(eq(objects.roomId, roomId));
}

export const getObjectById = async (id : number) => {
   return db
       .select()
       .from(objects)
       .where(eq(objects.id, id))
       .limit(1);
}

export const createObject = async (newObject: NewObject) => {
    if (newObject.id) {
        const o = await getObjectById(newObject.id);
        if (o[0]) {
            return;
        }
    }

    try {
        return db
            .insert(objects)
            .values(newObject)
            .returning({
                id: objects.id,
                title: objects.title,
                description: objects.description,
                image: objects.image,
                grade: objects.grade,
                ownerId: objects.ownerId,
                roomId: objects.roomId,
            });
    } catch {
        console.log("Failed to create object")
    }
}

export const updateObject = async (id: number, newObject: NewObject) => {
   return db
       .update(objects)
       .set(newObject)
       .where(eq(objects.id, id));
}

export const deleteObject = async (id: number) => {
    const o = await getObjectById(id);
    if (!o[0]) {
        return;
    }

   return db
       .delete(objects)
       .where(eq(objects.id, id))
       .returning();
}