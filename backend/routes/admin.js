// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');
const sendBoxLabelEmail = require('../emailing/labelsEmail.js');
const createLabels = require('../emailing/labelMaker.js');
const { json } = require('express');

const getItemTotals = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { year, orderID } = req.body;
    
        
        const start = `${year === undefined || year === null ? '1000' : year}-01-01`;
        const end = `${year === undefined || year === null ? '9999' : year}-12-31`

        const getItems = await pool.query(`SELECT * FROM order_item
        WHERE order_id IN (
            SELECT id FROM orders
            WHERE group_id IN (
                SELECT id FROM groups
                WHERE pickup BETWEEN $1 AND $2
            )
            AND ($3::INT IS NULL OR id = $3::INT)
        );`, [start, end, orderID]);

        if(getItems.rowCount === 0) {
            return res.status(204).json({ message: 'No Items Found'});
        }

        let price = 0;
        let volume = 0;

        const itemQuantity = new Map();

        for (const item of getItems.rows) {
            price += Number(item.price);
            volume += Number(item.cubic_feet);

            if(itemQuantity.has(item.name)) {
                itemQuantity.set(item.name, itemQuantity.get(item.name) + 1);
            } else {
                itemQuantity.set(item.name, 1);
            }
        }
       
        let quantity = []
        for (const item of itemQuantity) {
            quantity = [...quantity, { name: item[0], quantity: item[1]}];
        }
        
        
        res.status(200).json({ items: getItems.rows, price: price, volume: volume, quantities: quantity.sort((itemA, itemB) => itemB.quantity - itemA.quantity) })
        

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getUsers = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { year } = req.body;
    
        
        const start = `${year === undefined || year === null ? '1000' : year}-01-01`;
        const end = `${year === undefined || year === null ? '9999' : year}-12-31`

        const getUsers = await pool.query(`SELECT * FROM users 
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
        );`, [start, end]);

        if(getUsers.rowCount === 0) {
            return res.status(204).json({ message: 'No Users Found'});
        }
        
        res.status(200).json({ users: getUsers.rows })
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getOrders = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { year } = req.body;
    
        
        const start = `${year === undefined || year === null ? '1000' : year}-01-01`;
        const end = `${year === undefined || year === null ? '9999' : year}-12-31`

        const getOrders = await pool.query(`SELECT 
            o.*,
            u.name,
            u.email,
            u.phone
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN groups g ON o.group_id = g.id
        WHERE g.pickup BETWEEN $1 AND $2;`, [start, end]);

        if(getOrders.rowCount === 0) {
            return res.status(204).json({ message: 'No Users Found'});
        }
        
        res.status(200).json({ orders: getOrders.rows })
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getItems = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { year } = req.body;
        
        
        const start = `${year === undefined || year === null ? '1000' : year}-01-01`;
        const end = `${year === undefined || year === null ? '9999' : year}-12-31`

        const getItmes = await pool.query(`SELECT 
            oi.*,
            u.name AS student_name, 
            u.email, 
            u.phone,
            o.location,
            g.name AS group_name
        FROM order_item oi
        JOIN orders o ON oi.order_id = o.id
        JOIN users u ON o.user_id = u.id
        JOIN groups g ON o.group_id = g.id
        WHERE g.pickup BETWEEN $1 AND $2;`, [start, end]);



        if(getItmes.rowCount === 0) {
            return res.status(204).json({ message: 'No Users Found'});
        }
        
        
        res.status(200).json({ items: getItmes.rows })
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const updateBalance = async (req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { paid, orderID } = req.body;

        const updatedOrder = await pool.query(`UPDATE orders
        SET paid=$1
        WHERE id=$2
        RETURNING *`, [paid, orderID]);

        if(updatedOrder.rowCount === 0) {
            return res.status(500).json({ message: 'Error updating order'});
        }
        
        console.log(updatedOrder.rows[0]);
        
        res.status(200).json({ orders: updatedOrder.rows[0], message: "Balance Updated" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getAdmins = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {

        const getAdmins = await pool.query(`SELECT * FROM users 
        WHERE NOT role='student';`);

        if(getAdmins.rowCount > 0) {
            res.status(200).json(getAdmins.rows.map((admin) => {
                return {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                    role: admin.role
                }
            }))
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}


module.exports = { getItemTotals, getUsers, getOrders, updateBalance, getAdmins, getItems }
