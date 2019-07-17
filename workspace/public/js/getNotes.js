import { editFunc, delFunc, formError } from './popin.js';

const chooseColor = () => {
    event.stopPropagation();
    if(event.target.classList.contains('color-picker-item')) {
        const noteID = event.target.getAttribute('data-note-id');
        const color = event.target.getAttribute('data-color');
        
        fetch(`http://lab10.smartware-academy.ro/api/setcolor/${noteID}`, {
            method: 'PUT',
            body: JSON.stringify({ colorCode: color }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
            if(res.ok) {
                return res.json();
            }
        })
        .catch((error) => {
            console.log(error);
        });
        
        document.getElementById(noteID).style.backgroundColor = color;
    }
}

const getColorPickerHtml = (color, noteId) => {

    const colors = [
            '#FFF', '#F28882', '#FBBC04', '#FFF475',
            '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA',
            '#D7AEFB', '#FDCFE8', '#E6C9A8', '#E8EAED',
    ];
    
    const colorHtml = colors.reduce((acc, color) => {
        return acc+`<div style='background-color: ${color}' class='color-picker-item' data-note-id=${noteId} data-color=${color}></div>`;
    }, '');
    
    return `<div class='color-picker'>
            ${colorHtml}
            </div>`;
}

const getNoteContent = (noteId, title, note, image, color) => {
    let resp = '';
    if(image!==null && image!=='more') {
        resp += `<img src="images/notes/${image}"/>` 
    }
    
    if(image==='more') {
        resp += `<div id='slideContainer' data-picnr='0'>
                    <i id='leftArr' class="fas fa-arrow-left"></i> 
                        <img src="images/notes/${image}"/> 
                     <i id='rightArr' class="fas fa-arrow-right"></i>
                </div>
                 `;
        fetch(`http://lab10.smartware-academy.ro/api/moreimg/${noteId}/0`)
        .then(res => {
                if(res.ok) {
                    return res.json();
                }
            })
            .then(res => {
                const { image } = res;
                const thisNote = document.getElementById(`${noteId}`);
                const thisImage = thisNote.getElementsByTagName('img');
                thisImage[0].src = `images/notes/${image}`;
                const buttons = thisNote.getElementsByTagName('i');
                function makeButtons(button, way) {
                    
                    button.addEventListener('click', () => {
                        const thisDiv = thisNote.getElementsByTagName('div');
                        let picNr = thisDiv[0].getAttribute('data-picnr');
                        const oriPicNr = picNr;
                        if(way==='left' && picNr!=0) {
                            picNr--;
                        } else {
                            if(way==='right' && picNr!=4) {
                                picNr++;
                            }
                        }
                        if(oriPicNr!==picNr) {
                            
                            fetch(`http://lab10.smartware-academy.ro/api/moreimg/${noteId}/${picNr}`)
                            .then(res => {
                                    if(res.ok) {
                                        return res.json();
                                    }
                                }).then(res => { 
                                    const { image } = res;
                                    if(image!=='none') {
                                        thisImage[0].src = `images/notes/${image}`;
                                        thisDiv[0].setAttribute('data-picnr', picNr);
                                        picNr = thisDiv[0].getAttribute('data-picnr');
                                    }
                                }).catch(error => {
                                    console.log(error); 
                                });
                        }
                    });
                }
                
                makeButtons(buttons[0], 'left');
                makeButtons(buttons[1], 'right');
                
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    resp += `<h3>${title}</h3>
            <p>${note}</p>
            <div class="toolbox">
                <div class="left">
                    <i class="fas fa-pen edit-note"></i>
                    <i class="fas fa-palette color-picker-button">
                        ${getColorPickerHtml(color, noteId)}
                    </i>
                    <i class="fas fa-trash del-note"></i>
                </div>
                <div class="right">
                    <i class="fas fa-thumbtack pin-note"></i>
                </div>
            </div>`;
            
    return resp;
}

function generateNotes(notes) {
            const notesContainer = document.getElementById('notes-container');
            
            const pinnedNotes = notes.filter(note => note.pinned);
            const otherNotes = notes.filter(note => !note.pinned);
            
            let pinnedNotesContainer;
            let otherNotesContainer;
            
            if (pinnedNotes.length) {
                pinnedNotesContainer = document.createElement('DIV');
                const pinnedHeading = document.createElement('H2');
                pinnedHeading.innerText = 'Pinned notes';
                pinnedNotesContainer.appendChild(pinnedHeading);
                for (const note of pinnedNotes) {
                    const {id, title, note:content, image, color, pinned} = note;
                    const pinnedNote = document.createElement('div');
                    pinnedNote.setAttribute('id', note.id);
                    pinnedNote.classList.add('note');
                    if(note.pinned) {
                        pinnedNote.classList.add('pinned');
                    }
                    pinnedNote.style.backgroundColor = note.color || '#fff';
                    pinnedNote.innerHTML =  getNoteContent(id, title, content, image, color);
                    pinnedNotesContainer.appendChild(pinnedNote);
                }
                notesContainer.appendChild(pinnedNotesContainer);
            }
            
            if (otherNotes.length) {
                otherNotesContainer = document.createElement('DIV');
                const otherHeading = document.createElement('H2');
                otherHeading.innerText = 'Other notes';
                otherNotesContainer.appendChild(otherHeading);
                for (const note of otherNotes) {
                    const {id, title, note:content, image, color, pinned} = note;
                    const otherNote = document.createElement('div');
                    otherNote.setAttribute('id', note.id);
                    otherNote.classList.add('note');
                    if(!note.pinned) {
                        otherNote.classList.add('notpinned');
                    }
                    otherNote.style.backgroundColor = note.color || '#fff';
                    otherNote.innerHTML =  getNoteContent(id, title, content, image, color);
                    otherNotesContainer.appendChild(otherNote);
                }
                notesContainer.appendChild(otherNotesContainer);
            }
            
            const colorPickers = document.getElementsByClassName('color-picker');
            for (const colorPicker of colorPickers) {
                colorPicker.addEventListener('click', chooseColor);
            }
}

function regenerateNotes() {
    const order = document.getElementById('notes-order').value;
    fetch(`http://lab10.smartware-academy.ro/api/notes?order=${order}`)
        .then((res) => {
            if(res.ok) {
                return res.json();
            }
        })
        .then((notes) => {
            const notesContainer = document.getElementById('notes-container');
            const diffContainer =  document.querySelectorAll('#notes-container > div');
            if(diffContainer[0]) notesContainer.removeChild(diffContainer[0]);
            if(diffContainer[1]) notesContainer.removeChild(diffContainer[1]);
            generateNotes(notes);
            editFunc();
            delFunc();
            pinFunc();
            formError();
        })
        .catch((error) => {
            console.log(error);
        });
}

window.addEventListener('load', () => {
    
    let newColor = '#ffffff';
    
    const newColorPicker = document.getElementById('color-picker-new');
    newColorPicker.addEventListener('click', (event) => {
        if(event.target.classList.contains('color-picker-item')) {
            newColor = event.target.getAttribute('data-color');
        }
    });
    
    const saveBtn = document.getElementById('submit');
    
    saveBtn.addEventListener('click', (event) => {
        
        event.preventDefault();
        
        const newImage = document.getElementById('image');
        const newTitle = document.getElementById('title-input');
        const newDes = document.getElementById('content-input');
        
        const formData = new FormData();
        for(let i=0; i<newImage.files.length; i++ ) {
            formData.append('image', newImage.files[i]);
        }
        formData.append('title', newTitle.value);
        formData.append('note', newDes.value);
        formData.append('color', newColor);
        
        fetch(`http://lab10.smartware-academy.ro/api/notes`, {
            method: 'POST',
            body: formData,
        }).then(res => {
            if(res.ok) {
                regenerateNotes();
            }
        }).catch((error) => {
           console.log({ message: error.message}); 
        });
        
    });
    
    fetch('http://lab10.smartware-academy.ro/api/notes')
        .then((res) => {
            if(res.ok) {
                return res.json();
            }
        })
        .then(notes => {
            const notesContainer = document.getElementById('notes-container');
            const preloader = document.getElementById('preloader');
            notesContainer.removeChild(preloader);
            notesContainer.classList.remove('loading');
            generateNotes(notes);
            editFunc();
            delFunc();
            pinFunc();
            formError();
        })
        .catch((error) => {
            console.log(error);
        });

    setupNotesOrder();
});

function setupNotesOrder() {
    const dropdown = document.getElementById('notes-order');
    dropdown.addEventListener('change', (event) => {
        const order = event.target.value;
        regenerateNotes();
    });
}

const pinFunc = () => {
    let notes = document.getElementsByClassName('note');
    if(notes.length === 0) {
        return;
    }
    
    let pinBtnList = document.getElementsByClassName('pin-note');
    if(pinBtnList.length === 0) {
        return;
    }
    
    pinBtnList = Array.from(pinBtnList);
    
    pinBtnList.map((pinBtn, index) => {
        pinBtn.addEventListener('click', () => {
            const id = notes[index].getAttribute('id');
            const pinned = notes[index].classList.contains('pinned');
            fetch(`http://lab10.smartware-academy.ro/api/changepin/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ changeTo: !pinned }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                if(res.ok) {
                    const order = document.getElementById('notes-order').value;
                    fetch(`http://lab10.smartware-academy.ro/api/notes?order=${order}`)
                        .then((res) => {
                            if(res.ok) {
                                return res.json();
                            }
                        })
                        .then( regenerateNotes() )
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
        });
    });
}