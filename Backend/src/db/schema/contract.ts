import {date, integer, pgTable, real, serial, varchar} from "drizzle-orm/pg-core";
import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import {eq} from "drizzle-orm";

export const contract = pgTable("contract", {
    id: serial("id").notNull().primaryKey(),

    todayDate: date("today_date").notNull(),
    ownerFullName: varchar("owner_full_name").notNull(),
    tenant: varchar("tenant").notNull(),
    area: real("area").notNull(),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    rent: real("rent").notNull(),
    endDate: date("end_date").notNull(),
    payRentBeforeDay: integer("pay_rent_before_day").notNull(),
    payUtilityBeforeDay: integer("pay_utility_before_day").notNull(),

    apartmentId: integer("apartment_id").notNull(),
    tenantId: integer("tenant_id").notNull(),
});

export type Contract = typeof contract.$inferSelect;
export type NewContract = typeof contract.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',
});

const db = drizzle(pool);

export const getContract = async (apartmentId: number)  => {
    return db
        .select()
        .from(contract)
        .where(eq(contract.apartmentId, apartmentId));
}

export const getContractById = async (id: number) => {
    return db
        .select()
        .from(contract)
        .where(eq(contract.id, id));

}

export const createContract = async (newContract: NewContract) => {
    if (newContract.id) {
        const c = await getContractById(newContract.id);
        if (c[0]) {
            return;
        }
    }

    return db
        .insert(contract)
        .values(newContract)
        .returning({
            id: contract.id,
            todayDate: contract.todayDate,
            ownerFullName: contract.ownerFullName,
            tenant: contract.tenant,
            area: contract.area,
            address: contract.address,
            city: contract.city,
            rent: contract.rent,
            endDate: contract.endDate,
            payRentBeforeDay: contract.payRentBeforeDay,
            payUtilityBeforeDay: contract.payUtilityBeforeDay,
            apartmentId: contract.apartmentId,
            tenantId: contract.tenantId,
        });
}

export const updateContract = async (id: number, newContract: NewContract) => {
    return db
        .update(contract)
        .set(newContract)
        .where(eq(contract.id, id))
}

export const deleteContract = async (tenantId: number) => {
    return db
        .delete(contract)
        .where(eq(contract.tenantId, tenantId))
}