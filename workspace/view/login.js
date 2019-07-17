const content = require('./loginContent.js');
const footer = require('./signupLoginFooter');

const getLogin = ({ content, footer}, error) => `
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="./css/login.css">
    </head>
    <body>
        <div class="main">
            <div class="form-container">
                <div class="logo">
                    <img src="images/logo.svg"></img>
                </div>

                ${content(error)}
                ${footer()}

            </div>
        </div>
    </body>
</html>
`;

module.exports = (error) => {
    return getLogin({ content, footer }, error);
};
