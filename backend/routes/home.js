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
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('1',TRUE,'private note1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1')");
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

async function asyncFunctionNewNote(titel, isPrivate, content) {
  let conn;
  try {
    const query = "INSERT INTO notes(titel, isPrivate,content, user_id) VALUES (?,?,?,?)"
    conn = await pool.getConnection();
    //TODO: get authorId aus JWT vorher verify
    const authorId = 1;
    const note = await conn.query(query, [titel,isPrivate, content, authorId]);
    console.log(note); 
    const test = await conn.query("SELECT * FROM notes");
    console.log(test);  
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}
router.post('/new', async function (req, res) {
  console.log("post new note");
  const {titel, content, isPrivate} = req.body;
  const data = await asyncFunctionNewNote(titel, isPrivate, content);
  res.send({status : 1});
});

async function asyncFunctionUpdate(id,titel,isPrivate,content) {
  let conn;
  try { 
    const query = "UPDATE notes SET titel = ?, isPrivate = ?, content = ? WHERE note_id = ?"
    conn = await pool.getConnection();
    //TODO: get authorId aus JWT vorher verify
    const authorId = 1;
    const note = await conn.query(query, [titel,isPrivate, content, id]);
    console.log(note); 
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}
router.post('/update/:id', async function (req, res) {
  console.log("post update note");
  const {titel, content, isPrivate} = req.body;
  const data = await asyncFunctionUpdate(req.params.id,titel,isPrivate, content);
  res.send({status : 1});
});


module.exports = router;