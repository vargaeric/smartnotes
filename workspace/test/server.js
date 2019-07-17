const express = require('express');
const logger = require('morgan');
const apiRouter = require('./routes/api/index.js');

const app = express();
app.port = 80;

app.use(logger('dev'));
app.use(express.json());


app.use('/api', apiRouter);
app.get('*', (req, res) => { 
    res.send("Not found");
});

app.listen(app.port, () => {
    console.log(`Listening on port ${app.port}`);
});
