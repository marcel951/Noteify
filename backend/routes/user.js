const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const argon = require('argon2');
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
      conn.query("INSERT INTO user(username, pass) VALUES ('benjamin','fpv')");
      conn.query("INSERT INTO user(username, pass) VALUES ('jonathan','420')");
      const rows = await conn.query("SELECT * from user");
      // rows: [ {val: 1}, meta: ... ]
      console.log(rows);
      //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
      // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
  
    } finally {
      //if (conn) conn.release(); //release to pool
    }
  }

/* GET users listing. */
router.post('/register', async function (req, res, next) {
});


router.get('/test', async function (req, res) {
    console.log("moped");
    asyncFunction();
    res.send({ status: 1});

    
});

router.post('/login', async function (req, res, next) {
  try {
    let { username, password } = req.body; 
   
    const hashed_password = md5(password.toString())
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    
    con.query(
      sql, [username, hashed_password],
    function(err, result, fields){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        let token = jwt.sign({ data: result }, 'secret')
        res.send({ status: 1, data: result, token: token });
      }
     
    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
module.exports = router;