const header = require('./notesHeader.js');
const content = require('./notesContent.js');
const footer = require('./mainFooter.js');

const getNotes = ({ header, content, footer}, pin, notpin) => `
<!DOCTYPE html>
<html>
    <head>
        <title>Notes App</title>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        <link rel="stylesheet" type="text/css" href="./css/index.css">
        <link rel="stylesheet" type="text/css" href="./css/notes.css">
        <script type="module" src="js/popin.js"></script>
        <script type="module" src='js/getNotes.js'></script>
    </head>
    <body>

      ${header()}
      ${content(pin, notpin)}
      ${footer()}

    </body>
</html>
`;

module.exports = (pin, notpin) => {
    return getNotes({ header, content, footer }, pin, notpin);
}