const getSignupContent = (error = '') => `
<div class="form">
    <h3 class="form-title">Sign Up<h3>
    <form action="/signup" method="POST">
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email Address"/>
        </div>
        <div class="input-group">
            <label for="name">Name</label>
            <input type="name" id="name" name="nume" placeholder="Name"/>
        </div>
        <div class="input-group">
            <label for="pass">Password</label>
            <input type="password" id="pass" name="password" placeholder="Set your password">
        </div>
        <div class="input-group">
            <label for="copass">Confirm Password</label>
            <input type="password" id="copass" name="confirmPassword" placeholder="Type your password again">
        </div>
        <div class="error">
            ${error}
        </div>
        <input type="submit" class="button purple" value="Get started">
    </form>
    <div class="footer-link">
        Already have an account? <a href="/login">Sign in</a>
    </div>
</div>
`;

module.exports = getSignupContent;