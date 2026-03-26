SELECT * FROM users
WHERE registration_code=$1
AND id=$2;

SELECT * FROM users
WHERE email=$1
AND password=crypt($2, password);

SELECT * FROM groups
WHERE pickup BETWEEN $1 AND $2;

SELECT * FROM logs;

SELECT * FROM term_acknowledgement
WHERE user_id = $1;

-- Gets all orders for a user or gets all orders in the system if user_id is null
SELECT 
    o.*, 
    g.name,
    g.capacity,
    g.pickup,
    g.dropoff
FROM 
    orders o
JOIN 
    groups g ON o.group_id = g.id
WHERE 
    o.user_id = $1 OR $1 IS NULL;

-- Gets totals for a group
SELECT
    SUM(price) AS cost,
    SUM(cubic_feet) AS volume,
    COUNT(*) AS items
FROM order_item
WHERE order_id IN(
    SELECT id FROM orders
    WHERE group_id=1
);

-- Gets an orders items with quantities
SELECT 
    name,
    MIN(cubic_feet) AS cubic_feet,
    MIN(price) AS price,
    COUNT(*) AS quantity
FROM order_item
WHERE order_id = $1
GROUP BY name;

-- Gets item quantities and totals
SELECT * FROM order_item
WHERE order_id IN (
    SELECT id FROM orders
    WHERE group_id IN (
        SELECT id FROM groups
        WHERE pickup BETWEEN $1 AND $2
    )
    AND ($3 IS NULL OR id = $3)
);

-- Gets all students
SELECT * FROM users 
WHERE role='student'
AND id IN (
    SELECT user_id FROM orders
    WHERE group_id IN (
        SELECT id FROM groups
        WHERE group_id IN (
            SELECT id FROM groups
            WHERE pickup BETWEEN $1 AND $2
        )
    )
);

SELECT 
    o.*,
    u.*
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN groups g ON o.group_id = g.id
WHERE g.pickup BETWEEN '2025-01-01' AND '2025-12-31';

SELECT 
    o.*,
    u.name,
    u.email,
    u.phone,
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN groups g ON o.group_id = g.id
WHERE g.pickup BETWEEN '2025-01-01' AND '2025-12-31';

SELECT 
    oi.*,
    u.name, 
    u.email, 
    u.phone
FROM order_item oi
JOIN orders o ON oi.order_id = o.id
JOIN users u ON o.user_id = u.id
JOIN groups g ON o.group_id = g.id
WHERE g.pickup BETWEEN '2025-01-01' AND '2025-12-31';

SELECT * FROM orders
WHERE id IN (
    SELECT order_id FROM order_item
    WHERE id=1770
);

SELECT name, COUNT(*) AS total_quantity
FROM order_item
WHERE order_id = (
    SELECT order_id FROM order_item
    WHERE id = 1770
)
GROUP BY name;
