const express = require('express');
const indexRouter = require('./routes/index');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', indexRouter);

const options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

const server = https.createServer(options, app);

server.listen(4000, () => {
    console.log('listening on port 4000 (HTTPS)');
})
