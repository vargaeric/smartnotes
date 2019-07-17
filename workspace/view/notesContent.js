const getColorPickerHtml = () => {

    const colors = [
            '#FFF', '#F28882', '#FBBC04', '#FFF475',
            '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA',
            '#D7AEFB', '#FDCFE8', '#E6C9A8', '#E8EAED',
    ];
    
    const colorHtml = colors.reduce((acc, color) => {
        return acc+`<div style='background-color: ${color}' class='color-picker-item' data-color=${color}></div>`;
    }, '');
    
    return `<div id='color-picker-new'>
            ${colorHtml}
            </div>`;
}


const getNotesContent = (pin, notpin) => `
<main class="fixed-width">
    <form id="new-note" action='/api/notes' method='POST' enctype="multipart/form-data">
        <input type="text" name="title" id="title-input" placeholder="Title">
        <textarea name="note" id="content-input" placeholder="Take a note..."></textarea>
        <div id='formMsg'>You must complete the title and the description too.</div>
        <input type="file" name="image" id="image" multiple />
        <div class="toolbox">
            <div class="left">
                <i class="fas fa-palette color-picker-button">
                    ${getColorPickerHtml()}
                </i>
                <label for="image">
                <i class="fas fa-image"></i>
                </label>
            </div>
            <div class="right">
                <input type="submit" id="submit" value="Save notes">
            </div>
        </div>
    </form>
    <div id='notes-container'>
        <div id='preloader'></div>
    </div>
</main>
`;

module.exports = getNotesContent;