const express = require('express');
const db = require('../util/db.js');
const router = express.Router();

const getNotes = require('../view/notes.js');

router.get('/', async (req,res) => {
    if(req.session.userId) {
        const { session: { userId } } = req;
        const { query: { search } } = req;
        
        let result = null;
        let pin="", notpin="", imageText, border;
        
        if (search) {
           [result] = await db.query(
            'SELECT id,title,note,image,color,pinned FROM notes WHERE user_id = ? AND (title LIKE ? OR note LIKE ?) ' + 
           'ORDER BY created_at DESC', [userId, `%${search}%`, `%${search}%`]
           );
        } else {
            [result] = await db.query(
                'SELECT id,title,note,image,color,pinned FROM notes WHERE user_id = ? ORDER BY created_at DESC', userId
            );
        }
        
        //console.log(result);

        let base = (noteId, title, note, imageText, color, border) => `
            <div style="background-color: ${color} ${border}" class="note" id="${noteId}">
                ${imageText}
                <h3>${title}</h3>
                <p>${note}</p>
                <input type="file" name="image" id="image">
                <div class="toolbox">
                    <div class="left">
                        <i class="fas fa-pen edit-note"></i>
                        <i class="fas fa-palette"></i>
                        <label for="image">
                        <i class="fas fa-image"></i>
                        </label>
                        <i class="fas fa-trash del-note"></i>
                    </div>
                    <div class="right">
                        <i class="fas fa-thumbtack"></i>
                    </div>
                </div>
            </div>`;
        
        for(let i=0; i<result.length; i++) {
                    
            if(result[i].image===null) imageText = "";
            else imageText = `<img src="images/notes/${result[i].image}"/>`;
            
            if(result[i].color==='#ffffff') border = "; border: 1px solid #9d9d9d";
            else border = "";
            
            if(result[i].pinned===1) {
                pin +=  base(result[i].id, result[i].title, result[i].note, imageText, result[i].color, border);
            } else {
                notpin +=  base(result[i].id, result[i].title, result[i].note, imageText, result[i].color, border);
            }
        }
          
        res.send(getNotes(pin,notpin));
        
    } else {
        res.redirect('/login');
    }
});

module.exports = router;