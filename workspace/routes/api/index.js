const express = require('express');
const multer = require('multer');
const fs = require('fs');
const fetch = require('node-fetch');
const db = require('../../util/db.js');

const router = express.Router();
const upload = multer({ dest: './public/images/notes' });

router.get('/notes', async function handler(req, res) {
    const { session: { userId } } = req;
    let defaultOrder = 'DESC';
    let query = 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at';
    if(req.query && req.query.order && req.query.order.length && req.query.order==='created_asc') {
        defaultOrder = 'ASC';
    }
    query += ` ${defaultOrder}`;
    const [result] = await db.query(query, [userId]);
    res.json(result);
});

router.get('/notes/:id', async function handler(req, res) {
    const { id } = req.params;
    const [[result]] = await db.query(
        'SELECT * FROM notes WHERE id = ?',
        [id]
    );
    
    if (!result) {
       return res.sendStatus(404); 
    }
    res.json(result);
});

router.post('/notes', upload.array('image', 4), async (req, res) => {
   const { body: { title, note, color } } = req;
   const { session: { userId } } = req;
   let filename = null;
   let filenames = [];
   var func = req.files.map(function(file) {
      filenames.push(file.filename);
    });
    
   if(req.files.length === 1 || req.files.length === 0) {
        console.log(req.files.length);
        if(req.files.length === 1) {
            filename = filenames[0];
        }
        console.log(filename);
        try {
           const [result] = await db.query(
                "INSERT INTO `notes` (`user_id`, `title`, `note`, `image`, `color`)" +
                "VALUES (?, ?, ?, ?, ?)",
                [userId, title, note, filename, color]
            );
            console.log(result.insertId);
            res.json(result.insertId);
        } catch(e) {
            res.status(500).json({message: e.message});
        }
   } else {
       filename = 'more';
       
        try {
            
            let queryText = `INSERT INTO notes (user_id, title, note, image, color) 
            VALUES ('${userId}', '${title}', '${note}', '${filename}', '${color}') `;
            console.log(queryText);
            const [result] = await db.query(queryText);

            fetch(`http://lab10.smartware-academy.ro/api/lastid`)
            .then(res=>res.json())
            .then(res => {
                const { id } = res;
                for(let i = 0; i< req.files.length; i++) {
                    
                    fetch(`http://lab10.smartware-academy.ro/api/upmoreimg/${id}`, {
                      method: 'post',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({filename : filenames[i]}),
                    }).then(res => res.json())
                      .then(res => console.log(res));
                }
            });
            
            res.json(result.insertId);
        } catch(e) {
           res.status(500).json({message: e.message});
        }
   }
    
});

router.get('/lastid', async (req, res) => {
    try {
        const [[result]] = await db.query('SELECT id FROM notes ORDER BY id DESC');
        res.json(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
})

router.post('/upmoreimg/:id', async (req, res) => {
    const { id } = req.params;
    const { filename } = req.body;
    try {
        let queryText = `INSERT INTO images (note_id, image) VALUES ('${id}', '${filename}')`;
        await db.query(queryText);
        res.json({message: 'The image has been successfully uploaded!'});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
})

router.get('/moreimg/:id/:nr', async (req, res) => {
    const { id } = req.params;
    const { nr } = req.params;
    let image="none";
    try {
        const [result] = await db.query(`SELECT image FROM images WHERE note_id = ?`, [id]);
        for(let i=0; i<result.length; i++) {
            if(i==nr) {
                ({ image } = result[i]);
            }
        }
        res.json({image});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.post('/notes/:id', upload.single('image'), async (req, res) => {
   const { id } = req.params;
   const { image, note, title } = req.body;
   
   let filename = null;
   if(req.file) {
      ({ filename } = req.file);
   }
   
   if(filename === null) {
        db.query('UPDATE notes SET title = ? , note = ? WHERE id = ?',[title, note, id]);
   } else {
        db.query('UPDATE notes SET title = ? , note = ? , image = ? WHERE id = ?',[title, note, filename, id]);   
   }
   
   res.json({filename});

});

router.delete('/notes/:id', async (req, res) => {
   const { id } = req.params;
   try {
       const [result] = await db.query(
            'DELETE FROM notes WHERE id = ?', [id] 
        );
       res.json(result);
   } catch(e) {
       res.status(500).json({message: e.message});
   }
});

//color api

router.put('/setcolor/:id', async (req,res) => {
    const { id } = req.params;
    const { body: { colorCode } } = req;
    try {
        const [result] = await db.query(
                'UPDATE notes SET color = ? WHERE id = ?', [colorCode, id]
            );
        res.json(result);
    } catch(e) {
        res.status(500).json({ message: e.message});
    }
})

//changePinOrNotPinned

router.put('/changepin/:id', async (req, res) => {
    const { id } = req.params;
    const { body: { changeTo } } = req;
    try {
        const [result] = await db.query(
                'UPDATE notes SET pinned = ? WHERE id = ?', [changeTo, id]
            );
        res.json(result);
    } catch(e) {
        res.status(500).json({ message: e.message});
    }
})

//get all the images for one note
router.get('/noteimages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
                'SELECT image FROM images WHERE note_id = ?', [id]
            );
        res.json(result);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
})

//delete more pics for one note
router.delete('/delmorepics/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
                'DELETE FROM images WHERE note_id = ?', [id]
            );
        res.json(result);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
})

// delete image api
router.delete('/delpic/:filename', async (req, res) => {
    const { filename } = req.params;
    
    const path = `./public/images/notes/${filename}`;
    
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message});
      }
      res.json({ message: 'File succesfully deleted!'});
    });
});

//user api

router.post('/user', async (req, res) => {
    const { body: { email, nume, password } } = req;
    try {
        const [result] = await db.query(
            'INSERT INTO users (email, nume, password) VALUES (?,?,?)', [email, nume, password]
        );
        res.json(result);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { body : { nume , password } } = req;
    
    try {
        let result;
        
        if(nume && password) {
            [result] = await db.query('UPDATE users SET nume = ?, password = ? WHERE id = ?', [nume, password, id]);
        } else 
        if(nume) {
            [result] = await db.query('UPDATE users SET nume = ? WHERE id = ?', [nume, id]);  
        } else {
            [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
        }
            
        res.json(result);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?', [id]
        );
        res.json(result);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

// login api

router.post('/login', async (req, res) => {
    const { body : { email, password } } = req;
    
    try {
        const [[result]] = await db.query(
            'SELECT nume, password FROM users WHERE email = ?', [email] 
        )
        
        if(result===undefined) res.send("There is no user registered with this email!");
            else {
            const { nume: name, password: realPass } = result;
            if(password!==realPass) res.send("Incorrect password!");
            else res.send(`Hello ${name}! You have been succesfully logged in with your ${email} email!`);
        }
    } catch(e) {
        res.status(500).json({ message: e.message});
    }
})

module.exports = router;



