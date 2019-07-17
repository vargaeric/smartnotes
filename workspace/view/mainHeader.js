const getMainHeader = () => `
<div id="header">
    <div class="content">
        <div class="logo">
            <a href="/" title="Homepage">
                <img src="images/logo.svg"/>
            </a>
        </div>
        <div class="nav">
            <a href="/login" title="Login">Login</a>
            <a href="/signup" title="Sign Up">Sign Up</a>
        </div>
    </div>
</div>
`;

module.exports = getMainHeader;