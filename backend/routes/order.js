// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');
const sendBoxLabelEmail = require('../emailing/labelsEmail.js');
const createLabels = require('../emailing/labelMaker.js');


const checkTerms = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { userID } = req.body;

        const terms = await pool.query(`SELECT * FROM term_acknowledgement
        WHERE user_id = $1;`, [userID]);  

        if(terms.rowCount > 0) {
            res.status(200).json({ data: terms.rows[0].agreed, message: "Terms Found" });
        } else {
            res.status(200).json({ data: false, message: "No terms yet" });
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const updateTerms = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { userID, date, agreed } = req.body;
        

        const terms = await pool.query(`INSERT INTO term_acknowledgement (user_id, date, agreed)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO UPDATE
        SET user_id = $1, date = $2, agreed = $3;`, [userID, date, agreed]);

        if(terms.rowCount > 0) {
            res.status(200).json({ message: "Terms Accepted" });
        } else {
            res.status(500).json({ message: "Error Accepting terms" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const createOrder = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 

        const { userID, groupID, inventory, balance, location, groupName, isArriveEarly } = req.body;
        
        const checkAlreadyMade = await client.query(`SELECT * FROM orders
        WHERE user_id = $1 AND group_id = $2`, [userID, groupID]);

        if(checkAlreadyMade.rowCount > 0) {
            return res.status(409).json("Order already made for this group, please edit this one or create a new one with a different group.");
        }
        
        const initializeOrder = await client.query(`INSERT INTO orders (user_id, group_id, balance, location, isarriveearly)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;`, [userID, groupID, balance, location, isArriveEarly]);
        

        const query = `
            INSERT INTO order_item(order_id, name, cubic_feet, price, vault, status)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;


        let items = [];

        for(item of inventory) {
            const { name, cubic_feet, price, vault, status, quantity } = item;

            for (let i = 0; i < quantity; i++) {
                
                const itemInput = await client.query(query, [initializeOrder.rows[0].id, name, cubic_feet, price, vault, 'Ordered']);  

                items = [...items, { name: itemInput.rows[0].name, id: itemInput.rows[0].id + "" }]
            }
        }

        await client.query('COMMIT'); 

        sendBoxLabelEmail(user.email, user.name, location, items, items.length, groupName);

        res.status(200).json({ message: "OK", items: items, orderID: initializeOrder.rows[0].id });
        
        writeLog({ userName: user.name, description: `Order Created: balance = ${balance}`, route: req.originalUrl, statusCode: 500});


    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    } finally {
        client.release();
    }
}

const updateOrder = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    const client = await pool.connect(); 
    try {

        const { orderID, inventory, location, groupID } = req.body;

        const checkAlreadyMade = await client.query(`SELECT * FROM orders
        WHERE user_id = $1 AND group_id = $2 AND NOT id = $3`, [user.id, groupID, orderID]);

        if(checkAlreadyMade.rowCount > 0) {
            return res.status(409).json({ message: "Order already made for this group, please select a new one." });
        }

        const dropItems = await pool.query(`DELETE FROM order_item
        WHERE order_id=$1;`, [orderID]);

        await client.query('BEGIN'); 

        let balance = 0;

        for(item of inventory) {
            balance += Number(item.price) * Number(item.quantity);
        }

        await client.query(`UPDATE orders 
        SET balance=$1, location=$2, group_id=$3
        WHERE id=$4`, [balance, location, groupID, orderID])

        const query = `
            INSERT INTO order_item(order_id, name, cubic_feet, price, vault, status)
            VALUES($1, $2, $3, $4, $5, $6);
        `;

        for(item of inventory) {
            const { name, cubic_feet, price, vault, status, quantity } = item;

            for (let i = 0; i < quantity; i++) {
                const order = await client.query(query, [orderID, name, cubic_feet, price, vault, status]);  
            }
        }

        await client.query('COMMIT'); 

        res.status(200).json("OK");

    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    } finally {
        client.release();
    }
}

const deleteOrder = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { orderID } = req.body;

        const dropItems = await pool.query(`DELETE FROM order_item
        WHERE order_id=$1;`, [orderID]);

        const deleteOrder = await pool.query(`DELETE FROM orders WHERE id=$1 RETURNING *;`, [orderID]);
       

        if(deleteOrder.rowCount > 0) {
            res.status(200).json("Order deleted!");
            writeLog({ userName: user.name, description: "Order deleted!", route: req.originalUrl, statusCode: 200});
        } else {
            res.status(500).json("Error deleting order");
            writeLog({ userName: user.name, description: "Error deleting order.", route: req.originalUrl, statusCode: 500});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const deleteItem = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { itemID } = req.body;

        const deletedItem = await pool.query(`DELETE FROM order_item
        WHERE id=$1;`, [itemID]);

        if(deletedItem.rowCount > 0) {
            res.status(200).json("Item deleted!");
            writeLog({ userName: user.name, description: "Item deleted!", route: req.originalUrl, statusCode: 200});
        } else {
            res.status(500).json("Error deleting item");
            writeLog({ userName: user.name, description: "Error deleting item.", route: req.originalUrl, statusCode: 500});
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getOrders = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { userID, orderID } = req.body;

        const orders = await pool.query(`SELECT 
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
            o.user_id = $1 OR $1 IS NULL;`, [userID]);

        
        if(orders.rowCount > 0) {
            if(orderID === undefined || orderID === null) {
                res.status(200).json({ orders: orders.rows, message: "Orders Found"});
            } else {
                res.status(200).json({ orders: orders.rows.filter((order) => order.id === orderID), message: "Orders Found"});
            }
        } else {
            res.status(200).json({ orders: [], message: "No Orders Found" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getOrderItemsAndTotals = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { orderID } = req.body;

        const items = await pool.query(`SELECT * FROM order_item
        WHERE order_id = $1;`, [orderID]);

        const totals = await pool.query(`SELECT 
            SUM(price) AS cost,
            SUM(cubic_feet) AS volume
        FROM order_item
        WHERE order_id = $1;`, [orderID]);
        

        if(items.rowCount > 0) {
            res.status(200).json({ items: items.rows, totals: totals.rows[0], message: "Items Found"});
        } else {
            res.status(204).json({ message: "No Items Found" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getGroupTotals = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { groupID } = req.body;

        const group = await pool.query(`SELECT * FROM groups WHERE id=$1`, [groupID]);

        const totals = await pool.query(`SELECT
            SUM(price) AS cost,
            SUM(cubic_feet) AS volume,
            COUNT(*) AS items
        FROM order_item
        WHERE order_id IN(
            SELECT id FROM orders
            WHERE group_id=$1
        );`, [groupID]);
        
        

        if(totals.rowCount > 0) {
            res.status(200).json({ totals: totals.rows[0], message: "Totals Found", group: group.rows[0]});
        } else {
            res.status(200).json({ totals: {}, message: "No Totals for this group", group: group.rows[0] });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const downloadLabels = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { orderID } = req.body;

        const orderQuery = await pool.query(`SELECT * FROM orders WHERE id=$1`, [orderID]);
        const userQuery = await pool.query(`SELECT * FROM users WHERE id=$1`, [orderQuery.rows[0].user_id]);
        const orderItemsQuery = await pool.query(`SELECT * FROM order_item WHERE order_id=$1`, [orderID]);
        const groupQuery = await pool.query(`SELECT * FROM groups WHERE id=$1`, [orderQuery.rows[0].group_id]);

        const order = orderQuery.rows[0];
        const groupsUser = userQuery.rows[0];
        const group = groupQuery.rows[0].name;

        const pdfStream = createLabels(groupsUser.name, order.location, orderItemsQuery.rows, orderItemsQuery.rowCount, group).doc

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${groupsUser}_Labels.pdf"`);


        if(orderItemsQuery.rowCount === 0) {
            res.status(406).json("There are no labels for this student")
        } else {
            pdfStream.pipe(res);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getOrderItemsWithQuantity = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { orderID } = req.body;

        const orderItems = await pool.query(`SELECT 
            name,
            MIN(cubic_feet) AS cubic_feet,
            MIN(price) AS price,
            COUNT(*) AS quantity
        FROM order_item
        WHERE order_id = $1
        GROUP BY name;`, [orderID]);


        if(orderItems.rowCount > 0) {
            res.status(200).json({ message: "Items found", items: orderItems.rows});
        } else {
            res.status(200).json({ message: "No items found", items: []});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}


module.exports = { checkTerms, updateTerms, createOrder, updateOrder, deleteOrder, deleteItem, getOrders, getOrderItemsAndTotals, getGroupTotals, downloadLabels, getOrderItemsWithQuantity }
