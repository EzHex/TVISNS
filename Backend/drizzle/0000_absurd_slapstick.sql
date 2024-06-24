DO $$ BEGIN
 CREATE TYPE "basicObjects" AS ENUM('Table', 'Chair', 'Sofa', 'Bed', 'Cupboard', 'Wardrobe', 'Desk', 'TV', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "counter_types" AS ENUM('electricity', 'electricityNight', 'gas', 'coldWater', 'hotWater');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "directions" AS ENUM('None', 'North', 'East', 'South', 'West', 'NorthEast', 'SouthEast', 'SouthWest', 'NorthWest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "failure_states" AS ENUM('CREATED', 'IN_PROGRESS', 'DONE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "roles" AS ENUM('Admin', 'Owner', 'Tenant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "roomTypes" AS ENUM('Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Toilet', 'Balcony', 'Terrace', 'Hallway', 'Kids room', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "types" AS ENUM('Masonry', 'Block', 'Monolithic', 'Wooden', 'Log', 'Framework', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartment_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_date" date NOT NULL,
	"paid" boolean NOT NULL,
	"payment_amount" real NOT NULL,
	"tenant_id" integer,
	"apartment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"residence" varchar(255) NOT NULL,
	"micro_district" varchar(255) NOT NULL,
	"street" varchar(255) NOT NULL,
	"house_number" varchar NOT NULL,
	"area" real NOT NULL,
	"room_number" integer NOT NULL,
	"type" "types" NOT NULL,
	"floor" integer NOT NULL,
	"year" date NOT NULL,
	"heating" varchar(255) NOT NULL,
	"tenant_id" integer,
	"owner_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contract" (
	"id" serial PRIMARY KEY NOT NULL,
	"today_date" date NOT NULL,
	"owner_full_name" varchar NOT NULL,
	"tenant" varchar NOT NULL,
	"area" real NOT NULL,
	"address" varchar NOT NULL,
	"city" varchar NOT NULL,
	"rent" real NOT NULL,
	"end_date" date NOT NULL,
	"pay_rent_before_day" integer NOT NULL,
	"pay_utility_before_day" integer NOT NULL,
	"apartment_id" integer NOT NULL,
	"tenant_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "failures" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar NOT NULL,
	"failure_state" "failure_states" DEFAULT 'CREATED' NOT NULL,
	"apartment_id" integer NOT NULL,
	"object_id" integer NOT NULL,
	"tenant_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(255) NOT NULL,
	"grade" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"room_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_date" date NOT NULL,
	"value" real NOT NULL,
	"counter_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"area" real NOT NULL,
	"window_direction" "directions" NOT NULL,
	"room_type" "roomTypes" NOT NULL,
	"grade" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"apartment_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"blocked" boolean DEFAULT false NOT NULL,
	"role" "roles" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "utility_counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"counter_type" "counter_types" NOT NULL,
	"apartment_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartment_payments" ADD CONSTRAINT "apartment_payments_tenant_id_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartment_payments" ADD CONSTRAINT "apartment_payments_apartment_id_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_tenant_id_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "failures" ADD CONSTRAINT "failures_apartment_id_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "failures" ADD CONSTRAINT "failures_object_id_objects_id_fk" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "failures" ADD CONSTRAINT "failures_tenant_id_users_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readings" ADD CONSTRAINT "readings_counter_id_utility_counters_id_fk" FOREIGN KEY ("counter_id") REFERENCES "utility_counters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_apartment_id_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "utility_counters" ADD CONSTRAINT "utility_counters_apartment_id_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
