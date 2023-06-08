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
    try {
  
      conn = await pool.getConnection();
      //conn.query("INSERT INTO users(username, pass) VALUES ('benjamin','fpv')");
      //conn.query("INSERT INTO user(username, pass) VALUES ('jonathan','420')");
      const rows = await conn.query("SELECT * from users");
      // rows: [ {val: 1}, meta: ... ]
      console.log(new Date());
      console.log(rows);
      //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
      // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
  
    } finally {
      //if (conn) conn.release(); //release to pool
    }
  }

/* GET users listing. */
router.post('/register', async function (req, res, next) {
  console.log(new Date());
  console.log('Register triggered');

  let conn;

  try {
    console.log('Register start');
    conn = await pool.getConnection();
    let {username, email, password} = req.body;
    const hashed_password = await argon.hash(password.toString());

    const checkUsername = `SELECT username FROM users WHERE username = ?`;
    const newUser =`INSERT INTO users (username, pass, email) VALUES (?, ?, ?)`;

    console.log('Register #1');
    conn.query(checkUsername, [username], (err, result, fields) => {
      if(!result.length){
        conn.query(newUser, [username, hashed_password, email], (err, result, fields) => {
          if(err){
            res.send({status: 0, data: err});
          }else{
            let token = jwt.sign({data:result}, 'secret')
            res.send({status: 1, data: result, token: token});
          }
        })
      }
    });
    console.log('Register end');
    const rows = await conn.query("SELECT * from users");
    console.log(rows);
  } catch(error){
    res.send({status:0 , error: 'Registration failed'});
  }
});


router.get('/test', async function (req, res) {
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