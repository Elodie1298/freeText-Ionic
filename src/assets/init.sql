CREATE TABLE IF NOT EXISTS user (
    id_user INTEGER PRIMARY KEY UNIQUE,
    name TEXT,
    phone_number TEXT,
    country_code TEXT
);

CREATE TABLE IF NOT EXISTS message (
    id_message INTEGER UNIQUE,
    id_conversation INTEGER,
    id_user INTEGER,
    content TEXT,
    timestamp TEXT,
    synchronized NUMERIC
);

CREATE TABLE IF NOT EXISTS conversation (
    id_conversation INTEGER UNIQUE,
    title TEXT,
    timestamp TEXT
);

CREATE TABLE IF NOT EXISTS participant (
    id_user INTEGER,
    id_conversation INTEGER,
    nickname TEXT,
    timestamp INTEGER
);

CREATE TABLE IF NOT EXISTS message (
    id_message INTEGER UNIQUE,
    id_conversation INTEGER,
    id_user INTEGER,
    content TEXT,
    timestamp INTEGER
);

CREATE TABLE IF NOT EXISTS participant_temp (
    id_user INTEGER,
    id_conversation INTEGER,
    nickname TEXT,
    timestamp INTEGER
);

CREATE TABLE IF NOT EXISTS message_temp (
    id_message INTEGER PRIMARY KEY,
    id_conversation INTEGER,
    id_user INTEGER,
    content TEXT,
    timestamp INTEGER
);
