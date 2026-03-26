-- Reset registration code
UPDATE users
SET registration_code=$1
WHERE id=$2
OR email=$3;

--Update Users password
UPDATE users
SET password=crypt($1, gen_salt('bf')), registration_code=''
WHERE id=$2
AND registration_code=$3
RETURNING *;

-- Update a groups information
UPDATE groups
SET name=$1, capacity=$2, pickup=$3, dropoff=$4
WHERE id=$5;

-- deletes a group given an id
DELETE FROM groups
WHERE id=$1;

-- Adds new items and updates them if there is a conflict
INSERT INTO item (name, cubic_feet, price, UUID)
VALUES ($1, $2, $3, $4)
ON CONFLICT (UUID) DO UPDATE
SET name = $1, cubic_feet = $2, price = $3, UUID = $4;

-- Deletes an item based off of id
DELETE FROM item
WHERE id = $1
RETURNING *;

-- Upsert for term acknowledgment
INSERT INTO term_acknowledgement (user_id, date, agreed)
VALUES ($1, $2, $3)
ON CONFLICT (user_id) DO UPDATE
SET user_id = $1, date = $2, agreed = $3;

-- Update an orders fields
UPDATE orders 
SET balance=$1, location=$2, group_id=$3
WHERE id=$4

-- Update an orders balance
UPDATE orders
SET paid=$1
WHERE id=$2

-- Update a boxes vault
UPDATE order_item
SET vault=$1
WHERE id=$2;