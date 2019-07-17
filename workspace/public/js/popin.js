const popinContent = `
        <input type="text" name="title" id="popin-title-input" placeholder="Title">
        <textarea name="note" id="popin-content-input" placeholder="Take a note..."></textarea>
        <div id="errorMsg">You must complete the title and the description too.</div>
        <input type="file" name="image" id="popin-image">
        <div class="toolbox">
            <div class="left">
                <i class="fas fa-palette"></i>
                <label for="popin-image">
                <i class="fas fa-image"></i>
                </label>
            </div>
            <div class="right">
                <input type="submit" id="submit-popin" value="Save notes">
                <input type="button" id="close-popin" value="Cancel">
            </div>
        </div>
`;

const deleteContent = `
    <div>Are you sure you want to delete this note?<div>
    <div id='del-container'>
        <input type='button' id='del-yes' value='Yes'/>
        <input type='button' id='del-no' value='No'/>
    </div>
`;

const scrollNo = () => {
    const body = document.body;
    body.style.overflow = 'hidden'; 
}

const scrollYes = () => {
    const body = document.body;
    body.style.overflow = 'visible'; 
}


const createPopin = () => {
    const popinContainer = document.createElement('div');
    popinContainer.className = 'popin';
    popinContainer.setAttribute('id', 'popin');
    popinContainer.innerHTML = popinContent;
    
    const tmp = document.body.appendChild(popinContainer);
    return tmp;
}

const createDel = () => {
    const delContainer = document.createElement('div');
    delContainer.setAttribute('id', 'delPop');
    delContainer.innerHTML = deleteContent;
    
    const tmp = document.body.appendChild(delContainer);
    return tmp;
}

const createFail = () => {
    const failContainer = document.createElement('div');
    failContainer.setAttribute('id', 'failPop');
    failContainer.innerHTML = `<h6>Something went wrong! We couldn't make the changes on this note! </br>
    Please try again!</h6>
    <input type="button" id="ok" value="Ok">`;
    
    const tmp = document.body.appendChild(failContainer);
    return tmp;
}



export const editFunc = () => {
    
    let notes = document.getElementsByClassName('note');
    if(notes.length === 0) {
        return;
    }
    
    
    let editBtnList = document.getElementsByClassName('edit-note');
    if(editBtnList.length === 0) {
        return;
    }
    
    editBtnList = Array.from(editBtnList);
    
    editBtnList.map((editBtn, index) => {
        editBtn.addEventListener('click', () => {
            const popinExists = document.getElementById('popin');
            if (!popinExists) {
                
                scrollNo();
                
                const popin = createPopin();
                
                const closeBtn = popin.querySelector('#close-popin');
                
                closeBtn.addEventListener('click', () => {
                    scrollYes();
                    popin.remove();
                });
                
                const title = notes[index].querySelector('.note h3');
                const description = notes[index].querySelector('.note p');
                
                const popinInput = document.getElementById('popin-title-input');
                const popinDesInput = document.getElementById('popin-content-input');
                
                popinInput.value = title.textContent;
                popinDesInput.value = description.textContent;
                
                const saveBtn = document.getElementById('submit-popin');
                
                saveBtn.addEventListener('click', () => {
                    const id = notes[index].getAttribute('id');
                    const newTitle = popinInput.value;
                    const newDescription = popinDesInput.value;
                    
                    const newNote = {
                        title: popinInput.value,
                        note: popinDesInput.value,
                    };
                    
                    popinInput.value = popinInput.value.trim();
                    popinDesInput.value = popinDesInput.value.trim();
                    
                    if(popinInput.value === '' || popinDesInput.value === '') {
                        const error = document.getElementById('errorMsg');
                        error.style.display = 'block';
                    } else {
                        
                        const fileInput = document.getElementById('popin-image');
                        const formData = new FormData();
                        
                        formData.append('image', fileInput.files[0]);
                        formData.append('title', popinInput.value);
                        formData.append('note', popinDesInput.value);
                        
                        fetch(`http://lab10.smartware-academy.ro/api/notes/${id}`, {
                            method: 'POST',
                            body: formData,
                        }).then(res => {
                            if(res.status === 200) {
                                let imgNote = notes[index].querySelector('.note img');
                                let newSrc;
                                res.json().then(res => res.filename).then(function (res) { 
                                    newSrc = res;
                                    if(newSrc !== null) {
                                        if(imgNote === null) {
                                                const imgTag = document.createElement('img');
                                                let thisNote = notes[index];
                                                thisNote.insertBefore(imgTag, thisNote.childNodes[0]);
                                                imgNote = notes[index].querySelector('.note img');
                                        } else {
                                                let str = imgNote.src;
                                                str = str.slice(str.length-32,str.length);
                                                fetch(`http://lab10.smartware-academy.ro/api/delpic/${str}`, {method: 'DELETE'});
                                        }
                                        imgNote.src =  `images/notes/${newSrc}`;
                                    }
                                    title.innerHTML = popinInput.value;
                                    description.innerHTML = popinDesInput.value;
                                    scrollYes();
                                    popin.remove();
                                });
                            } else {
                                failFunc();
                            }
                        });
                    }
                });
            }
        });
    });
}

export const delFunc = () => {
    let notes = document.getElementsByClassName('note');
    if(notes.length === 0) {
        return;
    }
    
    let delBtnList = document.getElementsByClassName('del-note');
    if(delBtnList.length === 0) {
        return;
    }
    
    delBtnList = Array.from(delBtnList);
    
    delBtnList.map((delBtn, index) => {
        delBtn.addEventListener('click', () => {
            const delExists = document.getElementById('delPop');
            if(!delExists) {
                
                scrollNo();
                
                const del = createDel();
                
                const noBtn = del.querySelector('#del-no');
                
                noBtn.addEventListener('click', () => {
                    scrollYes();
                    del.remove();
                });
                
                const yesBtn = del.querySelector('#del-yes');
                
                yesBtn.addEventListener('click', () => {
                    
                    const id = notes[index].getAttribute('id');
                    
                    fetch(`http://lab10.smartware-academy.ro/api/notes/${id}`, {
                        method: 'DELETE',
                        headers: {'content-type' : 'application/json'},
                    }).then(res => {
                        if(res.status === 200) {
                            let imgNote = notes[index].querySelector('.note img');
                            let conNote = notes[index].querySelector('.note > #slideContainer');
                            if(imgNote!==null && conNote===null) {
                                let str = imgNote.src;
                                str = str.slice(str.length-32,str.length);
                                fetch(`http://lab10.smartware-academy.ro/api/delpic/${str}`, {method: 'DELETE'});
                            } else {
                                if(conNote!==null) {
                                     fetch(`http://lab10.smartware-academy.ro/api/noteimages/${id}`)
                                     .then( res => {
                                         if(res.ok)
                                            return res.json();
                                     })
                                     .then( res => {
                                         res.map( imgName => {
                                            const { image } = imgName;
                                            fetch(`http://lab10.smartware-academy.ro/api/delpic/${image}`, {method: 'DELETE'});
                                         });
                                         fetch(`http://lab10.smartware-academy.ro/api//delmorepics/${id}`, {method: 'DELETE'});
                                     })
                                     .catch( e => console.log(e));
                                }
                            }
                            notes[index].remove();
                            scrollYes();
                            del.remove();
                            
                            editFunc();
                            delFunc();
                            formError();
                        } else {
                            failFunc();
                        }
                    });
                    
                });
            }
        });
    });
}

const failFunc = () => {
    const failExists = document.getElementById('failPop');
    if(!failExists) {
        scrollNo();
        
        const fail = createFail();
        
        const okBtn = document.getElementById('ok');
        okBtn.addEventListener('click', () => {
            scrollYes();
            fail.remove();
        });
    }
    
}

export const formError = () => {
    
    const subBtn = document.getElementById('submit');
    const title = document.getElementById('title-input');
    const description = document.getElementById('content-input');
    
    subBtn.addEventListener('click', (event) => {
        if(title.value.trim()==='' || description.value.trim()==='') {
            event.preventDefault();
            const formMsg = document.getElementById('formMsg');
            formMsg.style.display = "block";
        }
    });
}

function search() {
    const searchInput = document.getElementById("search");
        searchInput.onkeyup = (event) => {
            const { target: { value } } = event;
            const noteList = Array.from(document.getElementsByClassName("note"));
            noteList.map(note => {
                const text = note.innerText;
                console.log(document.querySelector(".note").classList);
                if (!text.includes(value)) {
                    note.style.display='none';    
                } else {
                    note.style.display='block';                  
                }
                
            });
        }
}

window.onload = () => {
    search();
}