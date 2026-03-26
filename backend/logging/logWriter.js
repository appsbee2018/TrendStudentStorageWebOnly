// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');

const writeLog = async (logDetails) => {
    try {
        const { userName, description, route, statusCode } = logDetails;

        const log = await pool.query(`INSERT INTO log (user_name, description, route, status_code, timestamp)
        VALUES($1, $2, $3, $4, NOW());`, [userName, description, route, statusCode]);


    } catch (error) {
        console.log(error.message);
    }
}

module.exports = writeLog;