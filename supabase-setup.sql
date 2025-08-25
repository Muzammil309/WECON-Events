-- WECON Masawat Event Management Platform
-- Supabase Database Setup Script
-- Project: https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ORGANIZER', 'SPEAKER', 'ATTENDEE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
CREATE TYPE "TicketStatus" AS ENUM ('VALID', 'USED', 'CANCELLED');

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role "UserRole" NOT NULL DEFAULT 'ATTENDEE',
    "emailVerified" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS "Event" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    venue TEXT,
    "startAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS "Room" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    location TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speakers table
CREATE TABLE IF NOT EXISTS "Speaker" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    bio TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    "roomId" TEXT REFERENCES "Room"(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    track TEXT,
    room TEXT,
    "startAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session-Speaker junction table
CREATE TABLE IF NOT EXISTS "SessionSpeaker" (
    "sessionId" TEXT NOT NULL REFERENCES "Session"(id) ON DELETE CASCADE,
    "speakerId" TEXT NOT NULL REFERENCES "Speaker"(id) ON DELETE CASCADE,
    PRIMARY KEY ("sessionId", "speakerId")
);

-- Ticket Types table
CREATE TABLE IF NOT EXISTS "TicketType" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    "quantityTotal" INTEGER NOT NULL,
    "quantitySold" INTEGER NOT NULL DEFAULT 0,
    "salesStart" TIMESTAMP WITH TIME ZONE NOT NULL,
    "salesEnd" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    status "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS "Ticket" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
    "ticketTypeId" TEXT NOT NULL REFERENCES "TicketType"(id) ON DELETE CASCADE,
    "attendeeName" TEXT NOT NULL,
    "attendeeEmail" TEXT NOT NULL,
    "qrCode" TEXT UNIQUE NOT NULL,
    status "TicketStatus" NOT NULL DEFAULT 'VALID',
    "checkedInAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-in logs table
CREATE TABLE IF NOT EXISTS "CheckInLog" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "ticketId" TEXT NOT NULL REFERENCES "Ticket"(id) ON DELETE CASCADE,
    "checkedInAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "checkedInBy" TEXT,
    location TEXT
);

-- Resources table
CREATE TABLE IF NOT EXISTS "Resource" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT REFERENCES "Event"(id) ON DELETE CASCADE,
    "sessionId" TEXT REFERENCES "Session"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'link',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS "Submission" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "eventId" TEXT NOT NULL REFERENCES "Event"(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS "Feedback" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "sessionId" TEXT NOT NULL REFERENCES "Session"(id) ON DELETE CASCADE,
    "attendeeEmail" TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");
CREATE INDEX IF NOT EXISTS "idx_event_slug" ON "Event"("slug");
CREATE INDEX IF NOT EXISTS "idx_session_event" ON "Session"("eventId");
CREATE INDEX IF NOT EXISTS "idx_session_time" ON "Session"("startAt", "endAt");
CREATE INDEX IF NOT EXISTS "idx_ticket_qr" ON "Ticket"("qrCode");
CREATE INDEX IF NOT EXISTS "idx_ticket_order" ON "Ticket"("orderId");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON "Event" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON "Session" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123)
INSERT INTO "User" (id, name, email, password, role, "emailVerified") 
VALUES (
    'admin-user-id',
    'WECON Admin',
    'admin@weconmasawat.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- admin123
    'ADMIN',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample event
INSERT INTO "Event" (id, name, slug, description, venue, "startAt", "endAt")
VALUES (
    'wecon-masawat-2024',
    'WECON Masawat 2024',
    'wecon-masawat-2024',
    'The premier technology and innovation conference in Masawat',
    'Masawat Convention Center',
    '2024-12-15 09:00:00+00',
    '2024-12-15 18:00:00+00'
) ON CONFLICT (slug) DO NOTHING;
