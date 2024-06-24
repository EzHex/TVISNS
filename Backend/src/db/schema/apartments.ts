import {date, integer, pgTable, real, serial, varchar} from "drizzle-orm/pg-core";
import {types} from "./types";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {relations} from "drizzle-orm/relations";
import {users} from "./users";
import {apartmentPayments} from "./apartmentPayments";
import {rooms} from "./rooms";
import "dotenv/config";
import {eq} from "drizzle-orm";
import {utilityCounters} from "./utilityCounters";

export const apartments = pgTable("apartments", {
    id: serial("id").notNull().primaryKey(),
    title: varchar("title", {length: 255}).notNull(),
    residence: varchar("residence", {length: 255}).notNull(),
    microDistrict: varchar("micro_district", {length: 255}).notNull(),
    street: varchar("street", {length: 255}).notNull(),
    houseNumber: varchar("house_number").notNull(),
    area: real("area").notNull(),
    roomNumber: integer("room_number").notNull(),
    type: types("type").notNull(),
    floor: integer("floor").notNull(),
    year: date("year", {mode: "string"}).notNull(),
    heating: varchar("heating", {length: 255}).notNull(),
    tenantId: integer("tenant_id").references(() => users.id, {onDelete: "set null"}),
    ownerId: integer("owner_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
});

export const apartmentRelations = relations(apartments, ({one, many}) => ({
    apartmentPayments: many(apartmentPayments),
    utilityCounters: many(utilityCounters),
    rooms: many(rooms),
}));

export type Apartment = typeof apartments.$inferSelect;
export type NewApartment = typeof apartments.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getApartments = async (userId: number)  => {
    return db
        .select()
        .from(apartments)
        .where(eq(apartments.ownerId, userId));
}

export const createApartment = async (newApartment: NewApartment) => {
    if (newApartment.id) {
        const a = await getApartmentById(newApartment.id);
        if (a[0]) {
            return;
        }
    }

    try {
        return db
            .insert(apartments)
            .values(newApartment)
            .returning({
                id: apartments.id,
                title: apartments.title,
                residence: apartments.residence,
                microDistrict: apartments.microDistrict,
                street: apartments.street,
                houseNumber: apartments.houseNumber,
                area: apartments.area,
                roomNumber: apartments.roomNumber,
                type: apartments.type,
                floor: apartments.floor,
                year: apartments.year,
                heating: apartments.heating,
                tenantId: apartments.tenantId,
                ownerId: apartments.ownerId,
            });
    } catch {
        console.log("Failed to create apartment");
    }
}

export const getApartmentById = async (id: number) => {
    return db
        .select()
        .from(apartments)
        .where(eq(apartments.id, id))
        .limit(1);
}

export const updateApartment = async (id: number, newApartment: NewApartment) => {
    return db
        .update(apartments)
        .set(newApartment)
        .where(eq(apartments.id, id))
        .returning({
            id: apartments.id,
            title: apartments.title,
            residence: apartments.residence,
            microDistrict: apartments.microDistrict,
            street: apartments.street,
            houseNumber: apartments.houseNumber,
            area: apartments.area,
            roomNumber: apartments.roomNumber,
            type: apartments.type,
            floor: apartments.floor,
            year: apartments.year,
            heating: apartments.heating,
            tenantId: apartments.tenantId,
            ownerId: apartments.ownerId,
        });
}

export const deleteApartment = async (id: number) => {
    const a = await getApartmentById(id);
    if (!a[0]) {
        return;
    }

    return db
        .delete(apartments)
        .where(eq(apartments.id, id))
        .returning();
}

export const getTenantApartment = async (tenantId: number) => {
    return db
        .select()
        .from(apartments)
        .where(eq(apartments.tenantId, tenantId))
        .limit(1);
}