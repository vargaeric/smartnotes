const header = require('./mainHeader.js');
const content = require('./homepageContent.js');
const footer = require('./mainFooter.js');

const getHomePage = ({ header, content, footer }) => `
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="./css/index.css">
    </head>
    <body>
      ${header()}
      ${content()}
      ${footer()}
    </body>
</html>
`;

module.exports = getHomePage({ header, content, footer });