const express = require('express');
const router = express.Router();

const getHomepage = require('../view/homepage.js');

router.get('/', (req, res) => { 
    res.send(getHomepage);
});

module.exports = router;