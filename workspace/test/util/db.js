const mysql2 = require('mysql2');

const db = mysql2.createConnection({
    host: 'mysql',
    user: 'lab10',
    password: '6VcbY6sb',
    database: 'lab10',
});

module.exports = db.promise();