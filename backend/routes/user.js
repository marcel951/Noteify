const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');
const argon = require('argon2');
const util = require("util");

require('dotenv').config();

const argonSecret = process.env.ARGON_SECRET;


const pool = mariadb.createPool({
  //ACHTUNG!!!!!!!
    //host: 'localhost', //==> Kein Container Betrieb !!!!!!
    host: 'database', //==> Container Betrieb !!!!!!
    port: '3306',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

router.use(express.json({limit: "100mb", extended: true}))
router.use(express.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}))

const {zxcvbn, zxcvbnOptions} = require("@zxcvbn-ts/core");
const zxcvbnCommonPackage = require("@zxcvbn-ts/language-common");
const zxcvbnEnPackage = require("@zxcvbn-ts/language-en");
const zxcvbnDePackage = require("@zxcvbn-ts/language-de");

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnDePackage.dictionary
  },
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

// async function checkIfEmailExists(email){
//   const checkUsername = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';

//   try{
//     const conn = await pool.getConnection();
//     const result = await conn.query(checkUsername, [email]);
//     conn.release();

//     const count = result[0].count;
//     return count > 0;
//   } catch(error) {
//     console.error(error);
//     throw error;
//   }
// }

async function registerNewUser(username, password){
  const newUser ='INSERT INTO users (username, pass) VALUES (?, ?)';

  try{
    const conn = await pool.getConnection();
    const result = await conn.query(newUser, [username, password]);
    conn.release();

    return 1;
  } catch(error) {
    return 0;
  }
}


/* GET users listing. */
router.post('/register', async function (req, res, next) {
  const conn = await pool.getConnection();
  zxcvbnOptions.setOptions(options);

  try {
    const {username, password} = req.body;
    const zxcvbnResult = zxcvbn(password, [username]);
    const score = zxcvbnResult.score;
    const feedback = zxcvbnResult.feedback;
    if (score <= 2){
      res.send({status:2, score:score, feedback:feedback});
    }else{
      const hashed_password = await argon.hash(password.toString());

      if(username.length < 5){
        res.send({status: 0, error: 'username too short', msg:'Your username is too short. Use at least 5 letters.'});
      }else if(username.length > 15){
        res.send({status: 0, error: 'username too long', msg:'Your username is too long. Use less then 15 letters.'});
      }else{
        const userExists = await checkIfUserExists(username);
        // const emailExists = await checkIfEmailExists(email);
          const emailExists = false;
        if(userExists){
          res.send({status:0, error: 'username or email already taken', msg:'Your username or email is already taken.'});
        }else if(emailExists){
          res.send({status:0, error: 'username or email already taken', msg:'Your username or email is already taken.'});
        } else {
          
          const newUser = await registerNewUser(username, hashed_password);
          
          if(newUser > 0){
            const query = "SELECT user_id FROM users WHERE username = ?";
            userIdQuery = await conn.query(query,username);
            let token = jwt.sign({username:username, user_id: userIdQuery[0].user_id.toString()}, argonSecret,{ expiresIn: '1h' })
            res.send({status: 1, token: token, data:{username,user_id: userIdQuery[0].user_id.toString()}});
          } else {
            res.send({status: 0, data: err});
          }
        }
      }
    }
  } catch(error){
    //console.log(error);
    res.send({status:0 , error: 'Registration failed'});
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

router.post('/login', async function (req, res, next) {
  const con = await pool.getConnection();
  const argon2 = require('argon2');
  try {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;
    const result = await con.query(sql, [username]);
    if (result.length > 0) {
      const hashedPassword = result[0].pass;
      const isMatch = await argon2.verify(hashedPassword, password.toString());
      if (isMatch) {
        const query = `SELECT user_id FROM users WHERE username = ?`;
        userIdQuery = await con.query(query, [username]);
        let token = jwt.sign({username:username, user_id: userIdQuery[0].user_id.toString()}, argonSecret,{ expiresIn: '1h' })
        res.send({ status:1, data:{username,user_id: userIdQuery[0].user_id.toString()}, token:token });
      } else {
        res.send({status:0, error: 'invalid Username or Password', msg:'invalid Username or Password'});
      }
    } else {
      res.send({status:0, error: 'invalid Username or Password', msg:'invalid Username or Password'});
    }
  } catch (error) {
    res.send({ status: 0, error: error });
  } finally {
    if (con) con.release(); //release to pool
  }
});

// router.post('/checkPW', async function (req, res, next) {
//   zxcvbnOptions.setOptions(options);

//   try{
//     const {username, password} = req.body;
//     const zxcvbnResult = zxcvbn(password, [username]);
//     const score = zxcvbnResult.score;
//     const feedback = zxcvbnResult.feedback;
//     res.send({score:score, feedback:feedback});
//   } catch(error) {
//     res.send({ status: 0, error: error });
//   }
 
// });


module.exports = router;
