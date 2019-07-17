const express = require('express');
const router = express.Router();

const get404 = require('../view/404.js');

router.get('*', (req, res) => {
    res.send(get404);
})

module.exports = router;