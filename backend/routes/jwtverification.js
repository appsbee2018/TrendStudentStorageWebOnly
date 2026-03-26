// Copyright 2025 Tyler Marois. All rights reserved.
// This software is protected by copyright law and international treaties.

require('dotenv').config();
const key = process.env.JWT_KEY;
const writeLog = require('../logging/logWriter.js');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(" ")[1];
    
  
    if (token == null) {
        writeLog({ userName: "Unkown Access", description: `No Access Token`, route: req.originalUrl, statusCode: 401});
        return res.status(401).json("Access Token Invalid");
    } 

  
    jwt.verify(token, key, (err, token) => {
      if (err) {
        
        console.error(err.message)
        writeLog({ userName: "Unknown Access", description: `Access Token Denied: ${err.message}`, route: req.originalUrl, statusCode: 403});
        return res.status(403).json("Access Token Invalid");
      }

        
  
      next();
    });
  }

  module.exports = authenticateToken;