import { mysqlTable, bigint, varchar, text, mysqlEnum, timestamp, index } from 'drizzle-orm/mysql-core'

// Two tables, one per submission source — kept separate rather than a
// shared "submissions" table because contact and lead capture have
// different required fields and different downstream handling.
//
// emailStatus/emailError/emailSentAt track the *async* notification
// email, which is sent after the row is already committed (see
// /api/notify). The row itself — not the email — is the source of
// truth for "did we capture this enquiry."

export const contactSubmissions = mysqlTable(
  'contact_submissions',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    name: varchar('name', { length: 80 }).notNull(),
    company: varchar('company', { length: 120 }).notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    country: varchar('country', { length: 60 }).notNull(),
    phone: varchar('phone', { length: 24 }),
    service: varchar('service', { length: 80 }).notNull(),
    description: text('description').notNull(),
    ip: varchar('ip', { length: 45 }),
    userAgent: varchar('user_agent', { length: 255 }),
    emailStatus: mysqlEnum('email_status', ['pending', 'sent', 'failed']).notNull().default('pending'),
    emailError: text('email_error'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    emailSentAt: timestamp('email_sent_at'),
  },
  (t) => [index('idx_contact_email_created').on(t.email, t.createdAt)],
)

export const leadSubmissions = mysqlTable(
  'lead_submissions',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    name: varchar('name', { length: 80 }).notNull(),
    kind: varchar('kind', { length: 60 }).notNull(),
    scale: varchar('scale', { length: 60 }).notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    ip: varchar('ip', { length: 45 }),
    userAgent: varchar('user_agent', { length: 255 }),
    emailStatus: mysqlEnum('email_status', ['pending', 'sent', 'failed']).notNull().default('pending'),
    emailError: text('email_error'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    emailSentAt: timestamp('email_sent_at'),
  },
  (t) => [index('idx_lead_email_created').on(t.email, t.createdAt)],
)

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type LeadSubmission = typeof leadSubmissions.$inferSelect
export type NewLeadSubmission = typeof leadSubmissions.$inferInsert
