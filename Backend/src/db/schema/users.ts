import { drizzle } from 'drizzle-orm/node-postgres';
import {boolean, pgTable, serial, text, varchar} from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import "dotenv/config";
import { and, eq } from 'drizzle-orm';
import { roles } from './roles';
import {relations} from "drizzle-orm/relations";
import {apartments} from "./apartments";
import {apartmentPayments} from "./apartmentPayments";
import bcrypt from "bcryptjs";

export const users = pgTable("users", {
    id: serial("id").notNull().primaryKey(),
    fullName: text("full_name").notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    blocked: boolean("blocked").notNull().default(false),
    role: roles("role").notNull(),
});

export const userRelations = relations(users, ({many}) => ({
    apartments: many(apartments),
    apartmentPayments: many(apartmentPayments),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

const pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'postgres',        
});

const db = drizzle(pool);

export const getUsers = async () => {
    return db
        .select()
        .from(users);
}

export const createUser = async (newUser: NewUser) => {
    if (newUser.id) {
        const u = await getUserById(newUser.id);
        if (u[0]) {
            return;
        }
    }

    try {
        return db
            .insert(users)
            .values(newUser)
            .returning({
                id: users.id,
                fullName: users.fullName,
                email: users.email,
                password: users.password,
                blocked: users.blocked,
                role: users.role,
            });
    } catch  {
        console.log("Failed to add user");
    }
}

export const getUserByEmail = async (email: string) => {
    return db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
}

export const getUserById = async (id: number) => {
    return db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
}

export const updateUser = async (id: number, newUser: NewUser) => {
    return db
        .update(users)
        .set(newUser)
        .where(eq(users.id, id))
        .returning();
}

export const deleteUser = async (id: number) => {
    return db
        .delete(users)
        .where(eq(users.id, id))
        .returning();
}