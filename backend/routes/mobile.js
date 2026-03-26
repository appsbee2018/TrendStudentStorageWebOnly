// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');

const scanIn = async(req, res) => {
    
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { id, vault } = req.body;
        
        
        const updateItem = await pool.query(`UPDATE order_item
        SET vault=$1
        WHERE id=$2
        RETURNING *;`, [vault, id]);


        if(updateItem.rowCount === 1) {
            res.status(200).json({ message: "Item Checked In!"});
            writeLog({ userName: user.name, description: `Item added to vault: ${vault}`, route: "/mobile/scanin", statusCode: 200});
        } else {
            res.status(500).json({ message: "Error Checking In Item..."});
            writeLog({ userName: user.name, description: `Item not added to vault: ${vault}`, route: "/mobile/scanin", statusCode: 200});
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getOrderByBarcode = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { barcode } = req.body;
        
        const order = await pool.query(`SELECT * FROM orders
        WHERE id IN (
            SELECT order_id FROM order_item
            WHERE id=$1
        );`, [barcode]);

        const items = await pool.query(`SELECT name, COUNT(*) AS total_quantity
        FROM order_item
        WHERE order_id = (
            SELECT order_id FROM order_item
            WHERE id=$1
        )
        GROUP BY name;`, [barcode]);

        const student = await pool.query(`SELECT * FROM users
        WHERE id=$1`, [order.rows[0].user_id])


        if(order.rowCount === 1) {
            res.status(200).json({ message: "Order Found!", order: order.rows[0], items: items.rows, student: student.rows[0] });
        } else {
            res.status(500).json({ message: "Error retrieving order."});
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}



module.exports = { scanIn, getOrderByBarcode }
