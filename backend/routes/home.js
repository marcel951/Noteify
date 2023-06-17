const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost', 
    port: '3306',
    user:'admin', 
    password: 'admin',
    database: 'db_notes'
});


function authenticateToken(req, res, next){
  if (!req.headers.authorization) {
    res.status(401).send({ message: "Unauthorized" })
  } else {
    jwt.verify(req.headers.authorization, "1337leet420", function (err, decoded) {
        if(decoded){
            req.user = decoded.data
            console.log(req.user);
            next()
        }else{
            res.status(401).send({ message: "Unauthorized" })
        }
    })
  }
}


async function asyncFunction() {
    let conn;
    console.log("test-DB");
    try {
      conn = await pool.getConnection();
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('1',TRUE,'private note1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1 Test für falschen Zuigriff')");
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
    user_id = 1;
    const query = "SELECT * FROM notes WHERE notes.user_id = ?";
    const rows = await conn.query(query,[user_id]);
    console.log(rows);  
    return rows;
  } finally {
    //if (conn) conn.release(); //release to pool
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
    const query = "SELECT * FROM notes WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    const note = await conn.query(query, [id]);
    console.log(note);  
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}
router.get('/singlenote/:id', async function (req, res) {
  console.log("get SingleNote");
  const data = await asyncFunctionSinglePage(req.params.id);
  data.forEach(element => {
      element.note_id = element.note_id.toString();
      element.user_id = element.user_id.toString();
  });
  res.send({status : 1,data : data});
});

async function asyncFunctionNewNote(titel, isPrivate, content, authorId) {
  let conn;
  try {
    const query = "INSERT INTO notes(titel, isPrivate,content, user_id) VALUES (?,?,?,?)"
    conn = await pool.getConnection();
    //TODO: get authorId aus JWT vorher verify
    console.log(authorId);
    authorId = 1;
    const note = await conn.query(query, [titel,isPrivate, content, authorId]);
    console.log(authorId); 
    const test = await conn.query("SELECT * FROM notes");
    //console.log(test);  
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}

router.post('/new',authenticateToken, async function (req, res) {
  console.log("post new note");
  const {titel, content, isPrivate} = req.body;
  //console.log(req.headers);
  const data = await asyncFunctionNewNote(titel, isPrivate, content, req.user);
  res.send({status : 1});
});

async function asyncFunctionUpdate(id,titel,isPrivate,content,authorId,res) {
  let conn;
  try { 
    const query = "UPDATE notes SET titel = ?, isPrivate = ?, content = ? WHERE note_id = ?"
    conn = await pool.getConnection();
    //TODO: get authorId aus JWT vorher verify
    authorId = 1;
    const query2 = "SELECT user_id FROM notes WHERE note_id = ?";
    authorIdQuery = await conn.query(query2,[id]);
    if(authorId == authorIdQuery[0].user_id){
      const note = await conn.query(query, [titel,isPrivate, content, id]);
      console.log(note); 
      return note;
    }else{
        return -1;
    }

  } finally {
    //if (conn) conn.release(); //release to pool
  }
}
router.post('/update/:id',authenticateToken, async function (req, res) {
  console.log("post update note");
  const {titel, content, isPrivate} = req.body;
  const data = await asyncFunctionUpdate(req.params.id,titel,isPrivate, content,req.user,res);
  if(data === -1)res.status(401).send({ message: "Unauthorized" });
  else res.send({status : 1});  
});


module.exports = router;