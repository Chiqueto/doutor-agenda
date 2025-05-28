import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
});

export const clinicsTable = pgTable("clinics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTable = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  spceiality: text("spceiality").notNull(),
  // 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday, 0 - Sunday
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientsSexEnum = pgEnum("patients_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientsSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
