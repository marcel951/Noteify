const express = require('express');
const indexRouter = require('./routes/index');

const app = express();
app.use(express.json());
app.use('/', indexRouter);


app.listen(4000, () => {
    console.log('listening on port 4000');
})
