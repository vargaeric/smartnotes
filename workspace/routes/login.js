const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../util/db.js');

const getLogin = require("../view/login.js");

router.get('/', (req, res) => {
    if(req.session.userId) {
        res.redirect('/notes');
    } else {
        res.send(getLogin());   
    }
});

router.post('/', async (req, res) => {
    const { body: { email, password } } = req;
    if(!email || !password) {
        res.status(400).send('Missing required params!');
    }
    
    const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', email);
    console.log(user);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        console.log(req.session);
        res.redirect('/notes');
    } else {
        //console.log(email, password);
        res.send(getLogin('Email and/or password is not correct!'));
    }
});

module.exports = router;