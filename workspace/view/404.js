const header = require('./mainHeader.js');
const content = require('./404Content.js');
const footer = require('./mainFooter.js');

const get404 = ({ header, content, footer}) => `
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="./css/index.css">
        <link rel="stylesheet" type="text/css" href="./css/404.css">
    </head>
    <body>

      ${header()}
      ${content()}
      ${footer()}
      
    </body>
</html>
`;

module.exports = get404({ header, content, footer });