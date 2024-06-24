import {pgEnum} from "drizzle-orm/pg-core";

export const roles = pgEnum("roles",
    [ "Admin", "Owner", "Tenant"]
);

export enum Roles {
    Admin = "Admin",
    Owner = "Owner",
    Tenant = "Tenant",
}