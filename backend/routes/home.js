const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    //ACHTUNG!!!!!!!
    //host: 'localhost', //==> Kein Container Betrieb !!!!!!
    host: 'database', //==> Container Betrieb !!!!!!
    port: '3306',
    user:'admin', 
    password: 'admin',
    database: 'db_notes'
});

let userID;
let isAuthenticated = true;
function authenticateToken(req, res, next, search=false){
  if (!req.headers.authorization) {
    res.status(401).send({ message: "Unauthorized" })
  } else {
    jwt.verify(req.headers.authorization, "1337leet420", function (err, decoded) {
        if(decoded){
            req.user = decoded.user_id;
            userID = decoded.user_id;
            if(!search){next();}
        }else{
          if(err.name === 'TokenExpiredError') res.send({ message: "Token expired" });
          else  {res.status(401).send({ message: "Unauthorized" }); isAuthenticated = false;}
        }
    })
  }
}


async function asyncFunction() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT notes.*,users.username FROM notes JOIN users ON notes.user_id = users.user_id WHERE notes.isPrivate = FALSE");
      return rows;
    } finally {
      if (conn) conn.release(); //release to pool
    }
}
router.get('/publicnotes', async function (req, res) {
    const data = await asyncFunction();
    data.forEach(element => {
        element.note_id = element.note_id.toString();
        element.user_id = element.user_id.toString();
    });

    res.send({status : 1,data : data});
});

async function asyncFunctionUserNotes(user_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = "SELECT notes.*,users.username FROM notes JOIN users ON notes.user_id = users.user_id WHERE notes.user_id = ?";
    const rows = await conn.query(query,[user_id]);
    return rows;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.get('/usernotes',authenticateToken, async function (req, res) {
  const data = await asyncFunctionUserNotes(req.user);
  data.forEach(element => {
      element.note_id = element.note_id.toString();
      element.user_id = element.user_id.toString();
  });
  res.send({status : 1,data : data});
});

async function asyncFunctionSinglePage(id) {
  let conn;
  try {
    const query = "SELECT notes.*,users.username FROM notes JOIN users ON notes.user_id = users.user_id WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    const note = await conn.query(query, [id]);
    return note;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.get('/singlenote/:id', async function (req, res) {
  const data = await asyncFunctionSinglePage(req.params.id);
  data.forEach(element => {
      element.note_id = element.note_id.toString();
      element.user_id = element.user_id.toString();
  });
  res.send({status : 1,data : data});
});

async function asyncFunctionSinglePageDel(id, authorId) {
  let conn;
  try {
    const query = "DELETE FROM notes WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    const query2 = "SELECT user_id FROM notes WHERE note_id = ?";
    authorIdQuery = await conn.query(query2,[id]);
    if(authorId == authorIdQuery[0].user_id){
      const note = await conn.query(query, [id]);
      return note;
    }else{
        return -1;
    }
  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.delete('/singlenote/:id', authenticateToken, async function (req, res) {
  const data = await asyncFunctionSinglePageDel(req.params.id,req.user);
  if(data === -1)res.status(401).send({ message: "Unauthorized" });
  else {  
    res.send({status : 1}); 
  } 
});

async function asyncFunctionNewNote(titel, isPrivate, content, youtube, authorId) {
  let conn;
  try {
    const query = "INSERT INTO notes(note_id,titel, isPrivate,content, user_id, created, lastChanged, youtube) VALUES (?,?,?,?,?,?,?,?)"
    conn = await pool.getConnection();
    const date = new Date().toISOString().slice(0, 19);
    const note = await conn.query(query, [uuidv4(),titel,isPrivate, content, authorId,date,date,youtube]);
    return note;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

router.post('/new',authenticateToken, async function (req, res) {
  const {titel, content, isPrivate, youtube} = req.body;
  const data = await asyncFunctionNewNote(titel, isPrivate, content,youtube, req.user);
  res.send({status : 1});
});

async function asyncFunctionUpdate(id,titel,isPrivate,content,youtube,authorId,res) {
  let conn;
  try { 
    const query = "UPDATE notes SET titel = ?, isPrivate = ?, content = ?,  lastChanged = ?, youtube = ? WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    const query2 = "SELECT user_id FROM notes WHERE note_id = ?";
    authorIdQuery = await conn.query(query2,[id]);
    if(authorId == authorIdQuery[0].user_id){
      const date = new Date().toISOString().slice(0, 19);
      if(youtube === undefined) youtube="";
      const note = await conn.query(query, [titel,isPrivate, content,date,youtube, id]);
      return note;
    }else{
        return -1;
    }

  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.post('/update/:id',authenticateToken, async function (req, res) {
  const {titel, content, isPrivate, youtube} = req.body;
  const data = await asyncFunctionUpdate(req.params.id,titel,isPrivate, content,youtube,req.user,res);
  if(data === -1)res.status(401).send({ message: "Unauthorized" });
  else res.send({status : 1});  
});

async function searchPublicFunc(searchTerm, searchContent, searchAuthor) {
    let conn;
    try {
        const query ="SELECT notes.* from notes JOIN users ON notes.user_id = users.user_id WHERE (notes.titel LIKE CONCAT('%', ?, '%') OR notes.content LIKE CONCAT('%', ?, '%') OR users.username LIKE CONCAT('%', ?, '%')) AND notes.isPrivate = 0";
        conn = await pool.getConnection();
        const result = await conn.query(query, [
            searchTerm,
            searchTerm,
            searchTerm,
        ]);
        const notes = Array.from(result); // Konvertierung in ein Array
        notes.forEach((note) => {
        });
        return result;
    } finally {
        if (conn) conn.release();
    }
}

async function searchPrivateFunc(user_id, searchTerm) {
    let conn;
    try {
        const query ="SELECT notes.* from notes JOIN users ON notes.user_id = users.user_id WHERE ((notes.titel LIKE CONCAT('%', ?, '%') OR notes.content LIKE CONCAT('%', ?, '%') OR users.username LIKE CONCAT('%', ?, '%')) AND notes.isPrivate = 1) AND users.user_id = ?";
        conn = await pool.getConnection();
        const result1 = await conn.query(query, [
            searchTerm,
            searchTerm,
            searchTerm,
            user_id
        ]);
        const notes = Array.from(result1); // Konvertierung in ein Array
        notes.forEach((note) => {
        });
        return notes;
    } finally {
        if (conn) conn.release();
    }
}

router.get('/search',async (req, res, next) => {   
    let searchTerm = req.query.searchterm;

    const searchPrivate = req.query.searchPrivate === 'true';
    const searchPublic = req.query.searchPublic === 'true';
    let result = [];

    try {
        let user_id;
        if (searchPrivate) {
            authenticateToken(req,res,next,true);
            user_id = userID;
            if(user_id !== undefined){
            const privateResult = await searchPrivateFunc(
                user_id,
                searchTerm,
            );
            result = result.concat(privateResult);
            }
        }
        if (searchPublic) {
            const publicResult = await searchPublicFunc(
                searchTerm,
            );
            result = result.concat(publicResult);
        }            
        result.forEach((element) => {
            element.note_id = element.note_id.toString();
            element.user_id = element.user_id.toString();
        });
        if(searchPrivate) {
          if(user_id != undefined)
            res.send({status: 200, data: result});
        }else{
          res.send({status: 200, data: result});
        }
    } catch (err) {
        console.error('Fehler bei der Datenbankabfrage:', err);
        //res.status(500).json({ error: 'Fehler bei der Datenbankabfrage' });
    }
});



module.exports = router;