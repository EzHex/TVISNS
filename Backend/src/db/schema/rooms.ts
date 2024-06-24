import {integer, pgTable, real, serial, varchar} from "drizzle-orm/pg-core";
import {directions} from "./directions";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {apartments} from "./apartments";
import {relations} from "drizzle-orm/relations";
import {objects} from "./objects";
import "dotenv/config";
import {eq} from "drizzle-orm";
import {roomTypes} from "./roomTypes";
import { get } from "http";

export const rooms = pgTable("rooms", {
   id: serial("id").notNull().primaryKey(),
   name: varchar("name").notNull(),
   area: real("area").notNull(),
   windowDirection: directions("window_direction").notNull(),
   roomType: roomTypes("room_type").notNull(),
   grade: integer("grade").notNull(),
   ownerId: integer("owner_id").notNull(),
   apartmentId: integer("apartment_id").references(() => apartments.id, {onDelete: "cascade"}).notNull(),
});

export const roomRelations = relations(rooms, ({many}) => ({
   objects: many(objects),
}));

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getRooms = async (apartmentId: number)  => {
    return db
        .select()
        .from(rooms)
        .where(eq(rooms.apartmentId, apartmentId));
}

export const getRoomById = async (id : number) => {
    return db
        .select()
        .from(rooms)
        .where(eq(rooms.id, id))
        .limit(1);
}

export const createRoom = async (newRoom: NewRoom) => {
    if (newRoom.id) {
        const r = await getRoomById(newRoom.id);
        if (r[0]) {
            return;
        }
    }

    try {
        return db
            .insert(rooms)
            .values(newRoom)
            .returning({
                id: rooms.id,
                name: rooms.name,
                area: rooms.area,
                windowDirection: rooms.windowDirection,
                grade: rooms.grade,
                ownerId: rooms.ownerId,
                apartmentId: rooms.apartmentId,
            });
    } catch {
        console.log("Failed to create room");
    }
}

export const updateRoom = async (id: number, newRoom: NewRoom) => {
    return db
        .update(rooms)
        .set(newRoom)
        .where(eq(rooms.id, id))
        .returning({
            id: rooms.id,
            area: rooms.area,
            windowDirection: rooms.windowDirection,
            grade: rooms.grade,
            ownerId: rooms.ownerId,
            apartmentId: rooms.apartmentId,
        });
}

export const deleteRoom = async (id: number) => {
    const r = await getRoomById(id);
    if (!r[0]) {
        return;
    }

    return db
        .delete(rooms)
        .where(eq(rooms.id, id))
        .returning();
}