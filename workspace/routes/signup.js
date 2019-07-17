const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../util/db.js');

const getSignup = require('../view/signup.js');

router.get('/', (req, res) => {
    res.send(getSignup());
});

router.post('/', async (req, res) => {
   try {
        //console.log(req.body);
        let { body: { email, nume, password, confirmPassword } } = req;
        email = email && email.trim();
        nume = nume && nume.trim();
        password = password && password.trim();
        confirmPassword = confirmPassword && confirmPassword.trim();
        
        //console.log(email,nume,password,confirmPassword);
        
        if(!email || !password || !nume || !confirmPassword) {
            return res.send(getSignup('Missing required params!'));
        }

        const [[{count}]] = await db.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', email);

        if(count > 0) {
            return res.send(getSignup('Email already used!'));
        }
        
        if(password !== confirmPassword) {
            return res.send(getSignup('Passwords must match!'));
        }
        
        const encrypted = await bcrypt.hash(password, 10);
        //console.log(password, encrypted);
        
        await db.query(
            'INSERT INTO users(email, nume, password) VALUES (?, ?, ?)',
            [email, nume, encrypted]
        );
        
        res.redirect('/');
        
   } catch (e) {
       res.status(500).send(`Message:${e.message}`);
   }
})

module.exports = router;