// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');
const sendAdminRegistrationEmail = require('../emailing/adminRegistrationEmail.js');

const addGroup = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { name, capacity, pickup, dropoff } = req.body;

        const addGroup = await pool.query(`INSERT INTO groups (name, capacity, pickup, dropoff)
        VALUES($1, $2, $3, $4) RETURNING *;`, [name, capacity, pickup, dropoff]);

        if(addGroup.rowCount > 0) {
            res.status(200).json({ group: addGroup.rows[0], message: "Group Added Successfully"});
            writeLog({ userName: user.name, description: "Group Added Successfully", route: req.originalUrl, statusCode: 200});
        } else {
            res.status(500).json({ message: "Group failed to be added"});
            writeLog({ userName: user.name, description: "Group failed to be added", route: req.originalUrl, statusCode: 500});
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getGroupsByYear = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { year } = req.body;
        

        const groups = await pool.query(`SELECT * FROM groups
        WHERE pickup BETWEEN $1 AND $2;`, [`${year}-1-1`, `${year}-12-31`]);

        res.status(200).json({ groups: groups.rows, message: "Groups found"});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const updateGroup = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { name, capacity, pickup, dropoff, id } = req.body;
        

        const groups = await pool.query(`UPDATE groups
        SET name=$1, capacity=$2, pickup=$3, dropoff=$4
        WHERE id=$5 RETURNING *;`, [name, capacity, pickup, dropoff, id]);

        if(groups.rowCount > 0) {
            res.status(200).json({ groups: groups.rows, message: "Group updated"});
            writeLog({ userName: user.name, description: "Group updated", route: req.originalUrl, statusCode: 200});
        } else {
            res.status(403).json({ message: "Error updating group"});
            writeLog({ userName: user.name, description: "Error updating group", route: req.originalUrl, statusCode: 403});
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const deleteGroup = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {
        const { id } = req.body;
        

        const groups = await pool.query(`DELETE FROM groups
        WHERE id=$1 RETURNING *;`, [id]);

        if(groups.rowCount > 0) {
            res.status(200).json({ groups: groups.rows, message: "Group deleted"});
            writeLog({ userName: user.name, description: "Group deleted", route: req.originalUrl, statusCode: 200});
        } else {
            res.status(403).json({ message: "Error deleting group"});
            writeLog({ userName: user.name, description: "Error deleting group", route: req.originalUrl, statusCode: 403});
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getLogs = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {

        const logs = await pool.query(`SELECT * FROM log;`);

        res.status(200).json(logs.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const getItems = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    try {

        const logs = await pool.query(`SELECT * FROM item;`);

        res.status(200).json(logs.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    }
}

const updateItem = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 

        const { items } = req.body;
        

        for (const item of items) {
            const { name, cubic_feet, price, uuid } = item;

            const query = `
                INSERT INTO item (name, cubic_feet, price, UUID)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (UUID) DO UPDATE
                SET name = $1, cubic_feet = $2, price = $3, UUID = $4;
            `;

            await client.query(query, [name, cubic_feet, price, uuid]);
        }

        await client.query('COMMIT'); 

        return res.status(200).json({ message: "Items updated" });

    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    } finally {
        client.release();
    }
}

const deleteItem = async(req, res) => {
    const user = jwt.decode(req.headers.authorization.split(" ")[1]);
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN'); 

        const { items } = req.body;
        

        for (const item of items) {
            const { id } = item;

            const query = `
                DELETE FROM item
                WHERE id = $1
                RETURNING *;
            `;

            await client.query(query, [id]);
        }

        await client.query('COMMIT'); 

        return res.status(200).json({ message: "Item(s) deleted" });

    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: user.name, description: error.message, route: req.originalUrl, statusCode: 500});
    } finally {
        client.release();
    }
}

const addAdmin = async(req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let registrationCode = "";
        for (let i = 0; i < 6; i++) {
            registrationCode += chars.charAt(Math.random() * chars.length);
        }

        const signup = await pool.query(`INSERT INTO users (name, email, phone, role, registration_code)
        VALUES($1, $2, $3, $4, $5) RETURNING *;`, [name, email.toLowerCase(), phone, role, registrationCode]);

        sendAdminRegistrationEmail(signup.rows[0], registrationCode);
        
        res.status(200).json({ message: "Admin Added Successfully", admin: signup.rows[0]});
        writeLog({ userName: name, description: "Initial registration complete and email sent.", route: "/registration/signup", statusCode: 200});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        writeLog({ userName: req.name, description: error.message, route: "/registration/signup", statusCode: 500});
    }
}

module.exports = { addGroup, getGroupsByYear, updateGroup, deleteGroup, getLogs, updateItem, getItems, deleteItem, addAdmin }