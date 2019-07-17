const getNotesHeader = () => `
<div id="header">
    <div class="content">
        <div class="logo">
            <a href="/" title="Welcome">
                <img src="images/logo.svg"/>
            </a>
        </div>
        <form>
            <input type="text" id="search" class="search" name='search' placeholder="cauta..." />
        </form>
        <div class="styled-select">
            <select name="order" id="notes-order">
                <option value="created_desc">Created DESC</option>
                <option value="created_asc">Created ASC</option>
            </select>
        </div>
        <div class="nav">
            <a href="/logout" title="Logout" class="logout">
                <i class="fas fa-sign-out-alt"></i>Logout
            </a>
        </div>
    </div>
</div>
`;

module.exports = getNotesHeader;