CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE vehicles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make       TEXT NOT NULL,
    model      TEXT NOT NULL,
    year       INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2025),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);