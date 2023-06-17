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

const {zxcvbn, zxcvbnOptions} = require("@zxcvbn-ts/core");
const zxcvbnCommonPackage = require("@zxcvbn-ts/language-common");
const zxcvbnEnPackage = require("@zxcvbn-ts/language-en");
const zxcvbnDePackage = require("@zxcvbn-ts/language-de");

// import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
// import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
// import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
// import * as zxcvbnDePackage from "@zxcvbn-ts/language-de";



const options = {
  translations: zxcvbnDePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnDePackage.dictionary
  },
}

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

async function registerNewUser(username, password, email){
  const newUser ='INSERT INTO users (username, pass, email) VALUES (?, ?, ?)';

  try{
    const conn = await pool.getConnection();
    const result = await conn.query(newUser, [username, password, email]);
    conn.release();

    return 1;
  } catch(error) {
    return 0;
  }
}


/* GET users listing. */
router.post('/register', async function (req, res, next) {
  try {
    const conn = await pool.getConnection();
    const {username, email, password} = req.body;
    const hashed_password = await argon.hash(password.toString());

    

    const userExists = await checkIfUserExists(username);
    const emailExists = await checkIfEmailExists(email);

    if(userExists){
      res.send({status:0, error: 'username already taken', msg:'This username is already taken'});
    }else if(emailExists){
      res.send({status:0, error: 'email already taken', msg:'This email is already taken'});
    } else {
      
      const newUser = await registerNewUser(username, hashed_password, email);
      
      if(newUser > 0){
        let token = jwt.sign({username}, 'secret')
        res.send({status: 1, token: token, data:username});
      } else {
        res.send({status: 0, data: err});
      }
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
        const token = jwt.sign({data:username}, '1337leet420');
        console.log("Login Successful!");
        res.send({ status:1, data:username, token:token });
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

router.post('/checkPW', async function (req, res, next) {
  zxcvbnOptions.setOptions(options);

  try{
    const {username, email, password} = req.body;
    const zxcvbnResult = zxcvbn(password, [username, email]);
    const score = zxcvbnResult.score;
    const feedback = zxcvbnResult.feedback;
    res.send({score:score, feedback:feedback});
  } catch(error) {
    res.send({ status: 0, error: error });
  }
 
});


module.exports = router;
