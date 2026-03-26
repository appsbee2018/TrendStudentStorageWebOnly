const Pool = require("pg").Pool
require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: 'studentstorage-db-do-user-15873121-0.c.db.ondigitalocean.com',
//     port: 25060,    
//     database: "student-storage-v2",
//     ssl: { rejectUnauthorized: false }
// });

const pool = new Pool({
    user: 'postgres',
    password: "rootadmin",
    host: "localhost",
    port: 5432,    
    database: "student_storage_v2",
    ssl: false
});

module.exports = pool;