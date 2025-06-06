import { resetObjects, resizeCanvas, render, updateScore } from "./main.js";

const overlay = document.getElementById("login-overlay") as HTMLElement;
const appShell = document.getElementById("app") as HTMLElement;
const form = document.getElementById("login-form") as HTMLFormElement;
const loginError = document.getElementById("login-error") as HTMLElement;

const signupOverlay = document.getElementById("signup-overlay") as HTMLElement;
const signupForm = document.getElementById("signup-form") as HTMLFormElement;
const signupError = document.getElementById("signup-error") as HTMLElement;

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
function isAuthed(): boolean {
  return !!localStorage.getItem("user");
}

/* ───────── validation ───────── */
function validateEmail(email: string): string | null {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return ok ? null : "Please enter a valid email address.";
}
function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Password needs at least one capital letter.";
  if (!/\d/.test(pw)) return "Password needs at least one number.";
  return null;
}

/* ─── initial state ─── */
isAuthed() ? hideLogin() : showLogin();

/* ─── LOGIN ─── */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const email = (
    document.getElementById("email") as HTMLInputElement
  ).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;

  const pwErr = validatePassword(password);
  if (!email) loginError.textContent = "Email is required.";
  else if (pwErr) loginError.textContent = pwErr;
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
        } else {
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
document.getElementById("forgot-btn")?.addEventListener("click", () => {
  loginError.textContent = "Password recovery isn’t implemented yet.";
});

/* ─── SIGN-UP overlay ─── */
document.getElementById("show-signup")?.addEventListener("click", (e) => {
  e.preventDefault();
  showSignup();
});
document.getElementById("show-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  hideSignup();
});

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  signupError.textContent = "";

  const un = (
    document.getElementById("su-username") as HTMLInputElement
  ).value.trim();
  const em = (
    document.getElementById("su-email") as HTMLInputElement
  ).value.trim();
  const pw = (document.getElementById("su-password") as HTMLInputElement).value;
  const pw2 = (document.getElementById("su-password2") as HTMLInputElement)
    .value;

  const emErr = validateEmail(em);
  const pwErr = validatePassword(pw);

  if (!un) signupError.textContent = "Username is required.";
  else if (emErr) signupError.textContent = emErr;
  else if (pwErr) signupError.textContent = pwErr;
  else if (pw !== pw2) signupError.textContent = "Passwords don’t match.";
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
        } else {
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
document.getElementById("nav-signout")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  showLogin();
});
