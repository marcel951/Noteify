const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const argon = require('argon2');
const util = require("util");
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

async function checkIfUserExists(username){
  const checkUsername = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';

  try{
    const conn = await pool.getConnection();
    const result = await conn.query(checkUsername, [username]);
    conn.release();

    const count = result[0].count;
    return count > 0;
  } catch(error) {
    console.error(error);
    throw error;
  }
}

async function checkIfEmailExists(email){
  const checkUsername = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';

  try{
    const conn = await pool.getConnection();
    const result = await conn.query(checkUsername, [email]);
    conn.release();

    const count = result[0].count;
    return count > 0;
  } catch(error) {
    console.error(error);
    throw error;
  }
}


/* GET users listing. */
router.post('/register', async function (req, res, next) {
  try {
    const conn = await pool.getConnection();
    const {username, email, password} = req.body;
    const hashed_password = await argon.hash(password.toString());

    const newUser ='INSERT INTO users (username, pass, email) VALUES (?, ?, ?)';

    const userExists = await checkIfUserExists(username);
    const emailExists = await checkIfEmailExists(email);

    if(userExists){
      res.send({status:0, error: 'username already taken', msg:'This username is already taken'});
    }else if(emailExists){
      res.send({status:0, error: 'email already taken', msg:'This email is already taken'});
    } else {
      conn.query(newUser, [username, hashed_password, email], (err, result, fields) => {
        if(err){
          res.send({status: 0, data: err});
        }else{
          let token = jwt.sign({data:result}, 'secret')
          res.send({status: 1, data: result, token: token});
        }
      });
    }
  } catch(error){
    console.log(error);
    res.send({status:0 , error: 'Registration failed'});
  }
});




router.post('/login', async function (req, res, next) {
  const con = await pool.getConnection();
  const argon2 = require('argon2');
  console.log("login");
  try {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;
    console.log("username: ", username);
    const result = await con.query(sql, [username]);
    console.log("result: ", result[0].pass);
    if (result.length > 0) {
      const hashedPassword = result[0].pass;
      const isMatch = await argon2.verify(hashedPassword, password.toString());
      console.log("isMatch: ", isMatch);
      if (isMatch) {
        console.log("generate Token start");
        const token = jwt.sign({ data: result }, '1337leet420');
        console.log("Login Successful!!!!");
        res.send({ status: 1, data: result, token: token });

      } else {
        res.send({status:0, error: 'invalid Username or Password', msg:'invalid Username or Password'});
      }
    } else {
      res.send({status:0, error: 'invalid Username or Password', msg:'invalid Username or Password'});
    }
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});



module.exports = router;
