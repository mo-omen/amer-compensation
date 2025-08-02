/**
 * Checks if a user is authenticated and has the required role.
 * Redirects to login page if checks fail.
 * @param {string[]} allowedRoles - An array of roles allowed to access the page.
 * @returns {object|null} The current user object or null if not authorized.
 */
async function checkAuth(allowedRoles) {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = '/login.html';
        return null;
    }
    return user;
}

/**
 * Logs the current user out by notifying the server and clearing session storage.
 * @param {object} user - The current user object.
 */
async function logout(user) {
    try {
        await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
        });
    } catch (error) {
        console.error("Logout API call failed:", error);
    } finally {
        sessionStorage.removeItem('currentUser');
        window.location.href = '/login.html';
    }
}
