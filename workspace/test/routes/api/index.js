const express = require('express');
const fs = require("fs");
const db = require('../../util/db.js');
const content = fs.readFileSync("./users.json");

const router = express.Router();

const og = JSON.parse(content);
const { users: array } = og;

let takenArray = [];

router.post('/users/batchadd', async (req, res) => {
    const { body : { n } } = req;
    let result = [];
    let que = "INSERT INTO users_test (title, first, last, email) VALUES ";
    
    const [dbres] = await db.query('SELECT id FROM array_test WHERE taken = 1');
        
    let taken = 0;
    for(let i=0; i<dbres.length; i++) {
        const { id } = dbres[i];
        takenArray[id-1] = 1;
        taken++;
    }
        
    let index;
    
    if(n!==null && n!==undefined && 100-taken>=n) {
        
        for(let i=0; i<n; i++) {
            
            do {
                index = Math.floor((Math.random() * 100) + 1) - 1;
            }while(takenArray[index]===1);
            
            const { name : { title, first, last }, email } = array[index];
            result.push(array[index]);
            
            takenArray[index] = 1;
            
            que += ` ('${title}','${first}','${last}','${email}') `;
            if(n-1 !== i) que += ',';
            
            await db.query("UPDATE array_test SET taken = 1 WHERE id = ?",index+1);
        }
        
        await db.query(que);
        
    } else {
        
        for(let i=0; i<array.length; i++) {
            
            const { name : { title, first, last }, email } = array[i];
            result.push(array[i]);
            
            que += ` ('${title}','${first}','${last}','${email}') `;
            if(array.length-1 !== i) que += ',';
        }
        
        await db.query(que);
    }
    
    res.send(result);
});

module.exports = router;