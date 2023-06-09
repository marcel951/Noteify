const express = require('express');
const router = express.Router();

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost', 
    port: '3306',
    user:'admin', 
    password: 'admin',
    database: 'db_notes'
});

async function asyncFunction() {
    let conn;
    console.log("test-DB");
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT * FROM notes WHERE notes.isPrivate = FALSE");
      console.log(rows);  
      return rows;
    } finally {
      //if (conn) conn.release(); //release to pool
    }
}
router.get('/publicnotes', async function (req, res) {
    console.log("get");
    const data = await asyncFunction();
    res.send({ status: 1, data: data});
});

module.exports = router;