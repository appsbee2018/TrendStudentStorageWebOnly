// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const nodemailer = require('nodemailer');
require('dotenv').config();
const writeLog = require('../logging/logWriter.js');

const sendAdminRegistrationEmail = async (user, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.APP_PASSWORD,
        }
    });
    
    const mailOptions = {
        from: {
            name: "Trend Moving & Storage",
            address: process.env.EMAIL_USERNAME
        },
        to: user.email,
        subject: "Verify Registration",
        html: 
        `<body>
            <h1>Hey ${user.name.split(" ")[0]}!</h1>
            <br/>
            <h3>You have been added to the Trend Student Storage Portal!</h3>
            <h3>Please use the code below to verify your email address and complete your registration:</h3>
            <br/>
            <h2 style="color: #1B3F9C;">${token}</h2>
            <h3>Follow this link <a style="color: #1B3F9C;" href="https://trendstudentstorage.com/register/verify/${user.id}">here</a> to verify!</h3>
            
            <br/>
            <h3>Take care and feel free to reach out if you have any questions!</h3>
        </body>`
    }


    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email has been sent!");
        } catch (error) {
            console.log(error.message);
            writeLog({ userName: mailOptions.to, description: `Error: ${error.message}`, route: "/registration/initialsignup", statusCode: 500});
        }
    }
    
    sendMail(transporter, mailOptions);
}

//sendRegistrationEmail({ email: "t.marois@trendmoving.com", name: "Tyler Marois" }, 234524);

module.exports = sendAdminRegistrationEmail;