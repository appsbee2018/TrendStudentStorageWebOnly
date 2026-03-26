// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

const nodemailer = require('nodemailer');
require('dotenv').config();
const createLabels = require('./labelMaker.js');
const { Readable } = require('stream');
const fs = require('fs');

const sendBoxLabelEmail = (email, name, location, itemIDs, itemCount, group) => {
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
            name: "Trend Moving and Storage",
            address: process.env.EMAIL_USERNAME
        },
        to: email,
        subject: "Here are your box labels!",
        html: `<body>
                <div class="container">
                    
                    <h1 class="header">You are all set!</h1>

                    <p class="information">All that is left now is to print out and tape your labels on each item</p>
                    <p class="information">It is very important that the Unit ID is visible, for items that can't fit the barcode please attach something with the Unit ID to the item.<br /><br /></p>
                    <p class="information">Please only print and attach your labels once you're certain you no longer need to modify your order.</p>


                    <p class="information">We have it from here!</p>

                    <div class="contact">
                        <p class="information">If you have any questions please call: </p>
                        <a href="tel:+18555096683">(855) 509-6683</a>
                        <br>
                        <p class="information">Do not reply to this email, any questions can be emailed to the email below: </p>
                        <a href="mailto:mymove@trendmoving.com">mymove@trendmoving.com</a>
                    </div>
                    
                </div>
            </body>`,
        attachments: [
            {
                filename: `${name.split(" ").join("")}_Labels.pdf`,
                content: createLabels(name, location, itemIDs, itemCount, group).stream
            }
        ]
    }
    
    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email has been sent!");
        } catch (error) {
            console.log(error.message);
        }
    }
    
    sendMail(transporter, mailOptions);
}

//sendBoxLabelEmail("t.marois@trendmoving.com", "Tyler Marois", "14 - 18 Mill St.", [{id: "1",  name: "Harvard Box"}, {id: "2", name: "Harvard Box"}, {id: "3", name: "Harvard Box"}], 3, "A");

module.exports = sendBoxLabelEmail;
