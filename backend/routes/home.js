const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    //ACHTUNG!!!!!!!
    host: 'localhost', //==> Kein Container Betrieb !!!!!!
    //host: 'database', //==> Container Betrieb !!!!!!
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
            req.user = decoded.user_id
            console.log(req.user);
            next()
        }else{
          if(err.name === 'TokenExpiredError') res.send({ message: "Token expired" });
          else  res.status(401).send({ message: "Unauthorized" });
        }
    })
  }
}


async function asyncFunction() {
    let conn;
    try {
      conn = await pool.getConnection();
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('1',TRUE,'private note1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1')");
      //conn.query("INSERT INTO notes(user_id, isPrivate,content) VALUES ('2',FALSE,'public note 1 Test für falschen Zuigriff')");
      const rows = await conn.query("SELECT notes.*,users.username FROM notes JOIN users ON notes.user_id = users.user_id WHERE notes.isPrivate = FALSE");
      console.log(rows); 
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
    console.log(rows); 
    await conn.release(); 
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
    const query = "SELECT notes.*,users.username AS author FROM notes JOIN users ON notes.user_id = users.user_id WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    const note = await conn.query(query, [id]);
    console.log(note);  
    await conn.release();
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}
router.get('/singlenote/:id', async function (req, res) {
  console.log("get SingleNote");
  console.log(req.params.id)
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
    console.log(authorIdQuery)
    if(authorId == authorIdQuery[0].user_id){

      const note = await conn.query(query, [id]);
      console.log(note); 
      return note;
    }else{
        return -1;
    }
  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.delete('/singlenote/:id', authenticateToken, async function (req, res) {
  console.log("delete SingleNote");
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
    //TODO: get authorId aus JWT vorher verify
    console.log(authorId);
    const date = new Date().toISOString().slice(0, 19);
    const note = await conn.query(query, [uuidv4(),titel,isPrivate, content, authorId,date,date,youtube]);
    console.log(authorId); 
    const test = await conn.query("SELECT * FROM notes");
    //console.log(test);
    await conn.release();  
    return note;
  } finally {
    //if (conn) conn.release(); //release to pool
  }
}

router.post('/new',authenticateToken, async function (req, res) {
  console.log("post new note");
  const {titel, content, isPrivate, youtube} = req.body;
  //console.log(req.headers);
  console.log(youtube);
  const data = await asyncFunctionNewNote(titel, isPrivate, content,youtube, req.user);
  res.send({status : 1});
});

async function asyncFunctionUpdate(id,titel,isPrivate,content,youtube,authorId,res) {
  let conn;
  try { 
    const query = "UPDATE notes SET titel = ?, isPrivate = ?, content = ?,  lastChanged = ?, youtube = ? WHERE notes.note_id = ?"
    conn = await pool.getConnection();
    //TODO: get authorId aus JWT vorher verify
    const query2 = "SELECT user_id FROM notes WHERE note_id = ?";
    authorIdQuery = await conn.query(query2,[id]);
    if(authorId == authorIdQuery[0].user_id){
      const date = new Date().toISOString().slice(0, 19);
      //.toLocaleString("en-US", {timeZone: 'Europe/Berlin'})
      if(youtube === undefined) youtube="";
      const note = await conn.query(query, [titel,isPrivate, content,date,youtube, id]);
      console.log(note); 
      return note;
    }else{
        return -1;
    }

  } finally {
    if (conn) conn.release(); //release to pool
  }
}
router.post('/update/:id',authenticateToken, async function (req, res) {
  console.log("post update note");
  const {titel, content, isPrivate, youtube} = req.body;
  const data = await asyncFunctionUpdate(req.params.id,titel,isPrivate, content,youtube,req.user,res);
  if(data === -1)res.status(401).send({ message: "Unauthorized" });
  else res.send({status : 1});  
});

async function searchPublicFunc(searchTitle, searchContent, searchAuthor) {
    let conn;
    try {
        const query =
            "SELECT notes.*, users.username FROM notes JOIN users on notes.user_id = users.id WHERE (notes.title LIKE CONCAT('%', ?, '%') OR notes.content LIKE CONCAT('%', ?, '%') OR users.username LIKE CONCAT('%', ?, '%')) AND notes.isPrivate = 0";
        conn = await pool.getConnection();
        const result = await conn.query(query, [
            searchTitle,
            searchContent,
            searchAuthor,
        ]);
        console.log("DEBUG: " + result);
        const notes = Array.from(result); // Konvertierung in ein Array
        console.log("PublicSearch:");
        notes.forEach((note) => {
            console.log(note); // Ausgabe jedes einzelnen Ergebnisses
        });
        console.log("PublicSearchEnd");
        return result;
    } finally {
        if (conn) conn.release();
    }
}

async function searchPrivateFunc(user_id, searchTitle, searchContent, searchAuthor) {
    let conn;
    try {
        const query =
            "SELECT * FROM notes WHERE (notes.title LIKE ? OR notes.content LIKE ?) AND notes.user_id = ? AND notes.isPrivate = 1";
        conn = await pool.getConnection();
        const result1 = await conn.query(query, [
            `%${searchTitle}%`,
            `%${searchContent}%`,
            user_id,
        ]);
        const notes = Array.from(result1); // Konvertierung in ein Array
        console.log("PrivateSearchUser_ID: " + user_id);

        console.log("PrivateSearch:");
        notes.forEach((note) => {
            console.log(note); // Ausgabe jedes einzelnen Ergebnisses
        });
        console.log("PrivateSearchEnd");
        return notes;
    } finally {
        if (conn) conn.release();
    }
}

router.get('/search', authenticateToken, async (req, res) => {
    const searchTitle = req.query.title || '';
    const searchPrivate = req.query.privateNotes === 'true';
    const searchPublic = req.query.publicNotes === 'true';
    const searchContent = ''; // Setzen Sie hier den gewünschten Wert für den Inhaltssuchparameter ein
    const searchAuthor = ''; // Setzen Sie hier den gewünschten Wert für den Autorsuchparameter ein

    console.log("Query: " + searchTitle);
    console.log("Search Private: " + searchPrivate);
    console.log("Search Public: " + searchPublic);

    let result = [];

    try {
        if (searchPrivate) {
            const user_id = authenticateToken.user_id;
            const privateResult = await searchPrivateFunc(
                user_id,
                searchTitle,
                searchContent,
                searchAuthor
            );
            result = result.concat(privateResult);
        }
        if (searchPublic) {
            const publicResult = await searchPublicFunc(
                searchTitle,
                searchContent,
                searchAuthor
            );
            result = result.concat(publicResult);
            result.forEach((element) => {
                element.note_id = element.note_id.toString();
                element.user_id = element.user_id.toString();
            });
        }
        console.log("result: " + result);
        res.send({ status: 200, data: result });
    } catch (err) {
        console.error('Fehler bei der Datenbankabfrage:', err);
        res.status(500).json({ error: 'Fehler bei der Datenbankabfrage' });
    }
});



module.exports = router;