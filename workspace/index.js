const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const apiRouter = require('./routes/api');
const homepageRouter = require('./routes/homepage.js');
const notesRouter = require('./routes/notes.js');
const loginRouter = require('./routes/login.js');
const signupRouter = require('./routes/signup.js');
const notfoundRouter = require('./routes/404.js');

const app = express();
const port = 80;
const sessionCookie = 'notes.sid';


app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded());

app.use(session({
    store: new FileStore(),
    secret: 'asdfgh123',
    resave: false,
    saveUninitialized: false,
    name: sessionCookie,
}));

app.use('/api', apiRouter);
app.use('/', homepageRouter);
app.use('/notes', notesRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('*', notfoundRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));