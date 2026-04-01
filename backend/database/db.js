const Pool = require("pg").Pool
require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,    
//     database: "student-storage-v2",
//     ssl: { rejectUnauthorized: false }
// });

console.log("Connecting to host:", process.env.DB_HOST);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 25060, // Fallback to DO port if env fails
    database: process.env.DB_NAME || "student-storage-v2",
    ssl: { rejectUnauthorized: false }
});

// const pool = new Pool({
//     user: 'postgres',
//     password: "rootadmin",
//     host: "localhost",
//     port: 5432,    
//     database: "student_storage_v2",
//     ssl: false
// });

module.exports = pool;