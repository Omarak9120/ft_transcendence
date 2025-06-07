"use strict";
var _a;
/* profile-settings.ts – inline edit logic */
const editBtn = document.getElementById('settings-edit');
const saveBtn = document.getElementById('settings-save');
const cancelBtn = document.getElementById('settings-cancel');
const actions = document.getElementById('settings-actions');
const viewUsername = document.getElementById('view-username');
const viewEmail = document.getElementById('view-email');
const viewJoined = document.getElementById('view-joined');
const inUsername = document.getElementById('edit-username');
const inEmail = document.getElementById('edit-email');
const inPassword = document.getElementById('edit-password');
let editing = false;
/* initialise with localStorage */
(function fillInitial() {
    var _a;
    try {
        const user = JSON.parse((_a = localStorage.getItem('user')) !== null && _a !== void 0 ? _a : '{}');
        if (user.username)
            viewUsername.textContent = inUsername.value = user.username;
        if (user.email)
            viewEmail.textContent = inEmail.value = user.email;
        if (user.joined)
            viewJoined.textContent = user.joined;
    }
    catch ( /* ignore */_b) { /* ignore */ }
})();
/* ---------- helpers ---------- */
const toggleEdit = (on) => {
    editing = on;
    document.querySelectorAll('.edit-input')
        .forEach(el => el.classList.toggle('hidden', !on));
    document.querySelectorAll('#profile-fields span[id^="view-"]')
        .forEach(el => el.classList.toggle('hidden', on));
    actions.classList.toggle('hidden', !on);
    editBtn.classList.toggle('hidden', on);
};
const showToast = () => {
    const t = document.getElementById('profile-toast');
    t.style.opacity = '1';
    setTimeout(() => (t.style.opacity = '0'), 2000);
};
/* ---------- events ---------- */
editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener('click', () => toggleEdit(true));
cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => {
    var _a, _b;
    inUsername.value = (_a = viewUsername.textContent) !== null && _a !== void 0 ? _a : '';
    inEmail.value = (_b = viewEmail.textContent) !== null && _b !== void 0 ? _b : '';
    inPassword.value = '';
    toggleEdit(false);
});
saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener('click', () => {
    var _a;
    /* simple client-side validation */
    const u = inUsername.value.trim();
    const e = inEmail.value.trim();
    const p = inPassword.value;
    if (!u)
        return alert('Username cannot be empty.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
        return alert('Invalid email.');
    if (p && (!/[A-Z]/.test(p) || p.length < 8 || !/\d/.test(p)))
        return alert('Password must be ≥8 chars, 1 capital, 1 number.');
    /* pretend to POST … then update UI */
    viewUsername.textContent = u;
    viewEmail.textContent = e;
    if (p)
        inPassword.value = '';
    /* store locally (you’ll hit real API later) */
    localStorage.setItem('user', JSON.stringify(Object.assign(Object.assign({}, (JSON.parse((_a = localStorage.getItem('user')) !== null && _a !== void 0 ? _a : '{}'))), { username: u, email: e })));
    toggleEdit(false);
    showToast();
});
/* optional: collapse/expand settings list */
(_a = document.getElementById('toggle-settings')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    const list = document.getElementById('profile-fields');
    const caret = document.getElementById('settings-caret');
    list.classList.toggle('hidden');
    caret.classList.toggle('rotate-180');
});
