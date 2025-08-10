import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const donors = pgTable("donors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  bloodType: text("blood_type").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  weight: integer("weight").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isAvailable: boolean("is_available").default(true),
  isVerified: boolean("is_verified").default(false),
  totalDonations: integer("total_donations").default(0),
  rating: text("rating").default("0"),
  lastDonation: text("last_donation"),
});

export const bloodRequests = pgTable("blood_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  bloodType: text("blood_type").notNull(),
  unitsRequired: integer("units_required").notNull(),
  urgencyLevel: text("urgency_level").notNull(),
  hospital: text("hospital").notNull(),
  contactPerson: text("contact_person").notNull(),
  contactPhone: text("contact_phone").notNull(),
  notes: text("notes"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  status: text("status").default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const donorResponses = pgTable("donor_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull(),
  donorId: varchar("donor_id").notNull(),
  status: text("status").notNull(), // responded, accepted, declined
  responseTime: text("response_time").default(sql`CURRENT_TIMESTAMP`),
});

export const lifeSaverRequests = pgTable("life_saver_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterName: text("requester_name").notNull(),
  requesterEmail: text("requester_email").notNull(),
  requesterPhone: text("requester_phone").notNull(),
  selectedDonorId: varchar("selected_donor_id").notNull(),
  bloodType: text("blood_type").notNull(),
  unitsRequired: integer("units_required").notNull(),
  urgencyLevel: text("urgency_level").notNull(),
  hospital: text("hospital").notNull(),
  requestReason: text("request_reason").notNull(),
  notes: text("notes"),
  status: text("status").default("pending"), // pending, contacted, completed, cancelled
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
  isVerified: true,
  totalDonations: true,
  rating: true,
});

export const insertBloodRequestSchema = createInsertSchema(bloodRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertDonorResponseSchema = createInsertSchema(donorResponses).omit({
  id: true,
  responseTime: true,
});

export const insertLifeSaverRequestSchema = createInsertSchema(lifeSaverRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = typeof donors.$inferSelect;
export type InsertBloodRequest = z.infer<typeof insertBloodRequestSchema>;
export type BloodRequest = typeof bloodRequests.$inferSelect;
export type InsertDonorResponse = z.infer<typeof insertDonorResponseSchema>;
export type DonorResponse = typeof donorResponses.$inferSelect;
export type InsertLifeSaverRequest = z.infer<typeof insertLifeSaverRequestSchema>;
export type LifeSaverRequest = typeof lifeSaverRequests.$inferSelect;
