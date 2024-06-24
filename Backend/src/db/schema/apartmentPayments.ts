import {boolean, date, integer, pgTable, real, serial} from "drizzle-orm/pg-core";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {relations} from "drizzle-orm/relations";
import {users} from "./users";
import {apartments} from "./apartments";
import "dotenv/config";
import {eq} from "drizzle-orm";

export const apartmentPayments = pgTable("apartment_payments", {
    id: serial("id").notNull().primaryKey(),
    paymentDate: date("payment_date").notNull(),
    paid: boolean("paid").notNull(),
    paymentAmount: real("payment_amount").notNull(),
    tenantId: integer("tenant_id").references(() => users.id, {onDelete: "set null"}),
    apartmentId: integer("apartment_id").references(() => apartments.id, {onDelete: "cascade"}).notNull(),
});

export type ApartmentPayment = typeof apartmentPayments.$inferSelect;
export type NewApartmentPayment = typeof apartmentPayments.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getApartmentPayments = async (apartmentId: number)  => {
    return db
        .select()
        .from(apartmentPayments)
        .where(eq(apartmentPayments.apartmentId, apartmentId));
}

export const createApartmentPayment = async (newApartmentPayment: NewApartmentPayment) => {
    return db
        .insert(apartmentPayments)
        .values(newApartmentPayment)
        .returning({
            id: apartmentPayments.id,
            paymentDate: apartmentPayments.paymentDate,
            paid: apartmentPayments.paid,
            paymentAmount: apartmentPayments.paymentAmount,
            tenantId: apartmentPayments.tenantId,
            apartmentId: apartmentPayments.apartmentId,
        });
}

export const getTenantApartmentPayments = async (tenantId: number)  => {
    return db
        .select()
        .from(apartmentPayments)
        .where(eq(apartmentPayments.tenantId, tenantId));

}

export const getApartmentPayment = async (id: number)  => {
    return db
        .select()
        .from(apartmentPayments)
        .where(eq(apartmentPayments.id, id));
}

export const updateApartmentPayment = async (id: number, newApartmentPayment: NewApartmentPayment) => {
    return db
        .update(apartmentPayments)
        .set(newApartmentPayment)
        .where(eq(apartmentPayments.id, id));
}

export const deleteApartmentPayment = async (id: number) => {
    return db
        .delete(apartmentPayments)
        .where(eq(apartmentPayments.id, id))
        .returning();
}