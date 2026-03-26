-- Inserts a user into the DB
INSERT INTO users (name, email, phone, role, registration_code)
VALUES($1, $2, $3, $4, $5);

--Inserts a log into the DB
INSERT INTO log (user_name, description, route, status_code, timestamp)
VALUES('Tyler', 'test', '/test', 200, NOW());

--Inserts a group into the DB
INSERT INTO groups (name, capacity, pickup, dropoff)
VALUES($1, $2, $3, $4);

-- Initialize an order into the DB
INSERT INTO orders (user_id, group_id, balance, location)
VALUES($1, $2, $3, $4);

-- Insert an item to the order_item table
INSERT INTO order_item(order_id, name, cubic_feet, price, vault, status)
VALUES($1, $2, $3, $4, $5, $6);