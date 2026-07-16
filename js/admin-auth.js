/**
 * admin-auth.js
 * Included in every admin-*.html page (except admin-login.html).
 * Redirects to admin-login.html if the user is not logged in as admin.
 */
(function () {
    'use strict';

    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.replace('/admin-login.html');
        return;
    }

    try {
        // Decode JWT payload (base64url → JSON) — client-side only for UX guard.
        // Real auth is enforced server-side via the protect + admin middleware.
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Check token expiry
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.replace('/admin-login.html');
            return;
        }

        // Check role
        if (payload.role !== 'admin') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.replace('/admin-login.html');
            return;
        }

        // Expose token as global so all admin pages can use it
        window.ADMIN_TOKEN = token;

    } catch (e) {
        // Malformed token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.replace('/admin-login.html');
    }
})();
