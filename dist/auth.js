var _a, _b, _c, _d;
import { resetObjects, resizeCanvas, render, updateScore } from "./main.js";
const overlay = document.getElementById("login-overlay");
const appShell = document.getElementById("app");
const form = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const signupOverlay = document.getElementById("signup-overlay");
const signupForm = document.getElementById("signup-form");
const signupError = document.getElementById("signup-error");
/* ───────── helpers ───────── */
function showLogin() {
    overlay.classList.remove("hidden");
    appShell.classList.add("hidden");
    document.body.style.overflow = "hidden";
}
function hideLogin() {
    overlay.classList.add("hidden");
    appShell.classList.remove("hidden");
    document.body.style.overflow = "";
}
function showSignup() {
    signupOverlay.classList.remove("hidden");
    overlay.classList.add("hidden");
}
function hideSignup() {
    signupOverlay.classList.add("hidden");
    overlay.classList.remove("hidden");
}
function isAuthed() {
    return !!localStorage.getItem("user");
}
/* ───────── validation ───────── */
function validateEmail(email) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return ok ? null : "Please enter a valid email address.";
}
function validatePassword(pw) {
    if (pw.length < 8)
        return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw))
        return "Password needs at least one capital letter.";
    if (!/\d/.test(pw))
        return "Password needs at least one number.";
    return null;
}
/* ─── initial state ─── */
isAuthed() ? hideLogin() : showLogin();
/* ─── LOGIN ─── */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginError.textContent = "";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password")
        .value;
    const pwErr = validatePassword(password);
    if (!email)
        loginError.textContent = "Email is required.";
    else if (pwErr)
        loginError.textContent = pwErr;
    else {
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) // 👈 you may want to rename `username` to `email` in your form too
        })
            .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                loginError.textContent = data.error || "Login failed.";
            }
            else {
                localStorage.setItem("user", JSON.stringify(data.user));
                hideLogin();
                resetObjects();
                resizeCanvas();
                render();
                updateScore();
            }
        })
            .catch((err) => {
            console.error(err);
            loginError.textContent = "Network error. Please try again.";
        });
    }
});
/* Forgot-password stub */
(_a = document.getElementById("forgot-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    loginError.textContent = "Password recovery isn’t implemented yet.";
});
/* ─── SIGN-UP overlay ─── */
(_b = document.getElementById("show-signup")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
});
(_c = document.getElementById("show-login")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
    e.preventDefault();
    hideSignup();
});
signupForm === null || signupForm === void 0 ? void 0 : signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupError.textContent = "";
    const un = document.getElementById("su-username").value.trim();
    const em = document.getElementById("su-email").value.trim();
    const pw = document.getElementById("su-password").value;
    const pw2 = document.getElementById("su-password2")
        .value;
    const emErr = validateEmail(em);
    const pwErr = validatePassword(pw);
    if (!un)
        signupError.textContent = "Username is required.";
    else if (emErr)
        signupError.textContent = emErr;
    else if (pwErr)
        signupError.textContent = pwErr;
    else if (pw !== pw2)
        signupError.textContent = "Passwords don’t match.";
    else {
        fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: un, email: em, password: pw })
        })
            .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                signupError.textContent = data.error || "Signup failed.";
            }
            else {
                hideSignup();
                loginError.textContent = "Account created! Please sign in.";
            }
        })
            .catch((err) => {
            console.error(err);
            signupError.textContent = "Network error. Please try again.";
        });
    }
});
/* ─── sign-out via navbar ─── */
(_d = document.getElementById("nav-signout")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    localStorage.removeItem("user");
    showLogin();
});
