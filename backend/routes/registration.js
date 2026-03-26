// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const pool = require('../database/db.js');
const sendRegistrationEmail = require('../emailing/registrationEmail.js');
const writeLog = require('../logging/logWriter.js');
const forgotPasswordEmail = require('../emailing/forgotPassword.js');

const initialSignUp = async(req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let registrationCode = "";
        for (let i = 0; i < 6; i++) {
            registrationCode += chars.charAt(Math.random() * chars.length);
        }

        const signup = await pool.query(`INSERT INTO users (name, email, phone, role, registration_code)
        VALUES($1, $2, $3, $4, $5) RETURNING *;`, [name, email.toLowerCase(), phone, role, registrationCode]);

        sendRegistrationEmail(signup.rows[0], registrationCode);
        
        res.status(200).json(signup.rows[0]);
        writeLog({ userName: name, description: "Initial registration complete and email sent.", route: "/registration/signup", statusCode: 200});

    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.name, description: error.message, route: "/registration/signup", statusCode: 500});
    }
}

const checkRegistration = async(req, res) => {
    try {
        const { registrationCode, id } = req.body;

        const checkCode = await pool.query(`SELECT * FROM users
        WHERE registration_code=$1
        AND id=$2;`, [registrationCode.toUpperCase(), id]);
        

        if(checkCode.rowCount !== 0) {
            res.status(200).json(checkCode.rows[0]);
            writeLog({ userName: id, description: "Registration code verified successfully!", route: "/registration/checkregistration", statusCode: 200});
        } else {
            res.status(403).json("Invalid registration code please try again or request a new one.");
            writeLog({ userName: id, description: "Invalid registration code please try again or request a new one.", route: "/registration/checkregistration", statusCode: 403});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.id, description: error.message, route: "/registration/checkregistration", statusCode: 500});
    }
}

const resetRegistration = async(req, res) => {
    try {
        const { id, email, name } = req.body;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let registrationCode = "";
        for (let i = 0; i < 6; i++) {
            registrationCode += chars.charAt(Math.random() * chars.length);
        }

        const resendCode = await pool.query(`UPDATE users
        SET registration_code=$1
        WHERE id=$2
        OR email=$3 RETURNING *;`, [registrationCode.toUpperCase(), id, email]);

        sendRegistrationEmail(req.body, registrationCode);
        
        res.status(200).json(resendCode.rows[0]);
        
        writeLog({ userName: name, description: "Registration Reset", route: "/registration/resetregistration", statusCode: 200});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.name, description: error.message, route: "/registration/resetregistration", statusCode: 500});

    }
}

const updatePassword = async(req, res) => {
    try {
        const { password, id, registrationCode } = req.body;

        const updatePassword = await pool.query(`UPDATE users
        SET password=crypt($1, gen_salt('bf')), registration_code=''
        WHERE id=$2
        RETURNING *;`, [password, id]);

        if(updatePassword.rowCount !== 0) {
            res.status(200).json(updatePassword.rows[0]);
        } else {
            res.status(500).json("Oops something went wrong.");
            writeLog({ userName: req.id, description: "More than one password updated.", route: "/registration/resetpassword", statusCode: 500});
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.id, description: error.message, route: "/registration/resetpassword", statusCode: 500});

    }
}

const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;

        const userEmail = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);

        if(userEmail.rowCount === 1) {
            
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
            let registrationCode = "";
            for (let i = 0; i < 6; i++) {
                registrationCode += chars.charAt(Math.random() * chars.length);
            }
    
            const resendCode = await pool.query(`UPDATE users
            SET registration_code=$1
            WHERE id=$2
            OR email=$3 RETURNING *;`, [registrationCode.toUpperCase(), userEmail.rows[0].id, email]);
    
            sendRegistrationEmail(resendCode.rows[0], registrationCode);

            res.status(200).json(resendCode.rows[0]);

        } else if(userEmail.rowCount > 1) {
            res.status(500).json("Oops something went wrong.");
            writeLog({ userName: req.id, description: "More than one password updated.", route: "/registration/resetpassword", statusCode: 500});
        } else if(userEmail.rowCount === 0) {
            res.status(406).json("No account with that email");
            writeLog({ userName: req.id, description: "No account with that email", route: "/registration/resetpassword", statusCode: 500});
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
        writeLog({ userName: req.id, description: error.message, route: "/registration/resetpassword", statusCode: 500});

    }
}

module.exports = { initialSignUp, checkRegistration, resetRegistration, updatePassword, forgotPassword }