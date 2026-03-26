// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(`SELECT * FROM users
        WHERE email=$1
        AND password=crypt($2, password);`, [email.toLowerCase(), password]);
        

        if(user.rowCount === 0) {
            res.status(403).json("Invalid email or password.");
            writeLog({ userName: email, description: "Invalid email or password.", route: "/authentication/login", statusCode: 403});
        } else {
            const { id, name, email, phone, registrationCode, settings, role } = user.rows[0];

            const userData = {
                id: id,
                name: name,
                email: email,
                phone: phone,
                registrationCode: registrationCode,
                settings: settings,
                role: role
            }
            

            jwt.sign(userData, process.env.JWT_KEY, { expiresIn: '24h'},(err, token) => {
                if(err) { 
                    console.error(err) 
                    res.status(500).json("Token generation failed");
                    writeLog({ userName: email, description: `Token generation failed: ${err.message}`, route: "/authentication/login", statusCode: 500});
                }    

                res.status(200).json(token);
                writeLog({ userName: email, description: `Signed in successfully`, route: "/authentication/login", statusCode: 200});
            });
        }
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.name, description: error.message, route: "/authentication/login", statusCode: 500});
    }
}

module.exports = { login }