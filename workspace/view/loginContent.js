const getLoginContent = (error = '') => `
<div class="form">
    <h3 class="form-title">Login<h3>
    <form action="/login" method="POST">
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email"/>
        </div>
        <div class="input-group">
            <label for="pass">Password</label>
            <input type="password" id="pass" name="password" placeholder="Password">
        </div>
        <div class="remember-me">
            <input type="checkbox" id="remember-me" name="remember-me">
            <label for="remember-me">Remember me</label>
        </div>
        <div class="error">
            ${error}
        </div>
        <input type="submit" class="button purple" value="Sign in">
    </form>
    <hr/>
    <input onclick="location.href='/signup';" type="button" class="button black" name="" value="Create account">
    <div class="footer-link">
        <a href="">Forgot your password?</a>
    </div>
</div>
`;

module.exports = getLoginContent;