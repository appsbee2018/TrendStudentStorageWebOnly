CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password TEXT,
    role role,
    settings JSON,
    registration_code VARCHAR(6)
);

CREATE TABLE log(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    description VARCHAR(512),
    route VARCHAR(255),
    status_code INTEGER,
    timestamp TIMESTAMP(2) WITH TIME ZONE
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32),
    capacity INT,
    pickup DATE,
    dropoff DATE
);

CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    cubic_feet NUMERIC(5, 2),
    price NUMERIC(10, 2),
    UUID VARCHAR(36) UNIQUE NOT NULL
);

CREATE TABLE term_acknowledgement (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE,
    date DATE,
    agreed BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    balance NUMERIC(8, 2) DEFAULT 0,
    location VARCHAR(255),
    paid BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    name VARCHAR(255),
    cubic_feet NUMERIC(5, 2),
    price NUMERIC(8, 2),
    vault INTEGER,
    status VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);