// Quick Frontend Status Check - Run in Browser Console

console.log("🔍 FRONTEND STATUS CHECK");
console.log("=".repeat(50));

// 1. Check authentication state
const isLoggedIn = !!localStorage.getItem("user");
const token = localStorage.getItem("token");
console.log("🔐 Authentication State:", isLoggedIn ? "✅ LOGGED IN" : "❌ NOT LOGGED IN");
console.log("🎫 Token exists:", !!token);

// 2. Check current URL and expected modal state
const currentPath = window.location.pathname;
console.log("📍 Current URL:", currentPath);

// 3. Check modal visibility
const loginModal = document.getElementById("login-overlay");
const signupModal = document.getElementById("signup-overlay");
const appContent = document.getElementById("app");

const loginVisible = loginModal && !loginModal.classList.contains("hidden");
const signupVisible = signupModal && !signupModal.classList.contains("hidden");
const appVisible = appContent && !appContent.classList.contains("hidden");

console.log("👁️ Login modal visible:", loginVisible);
console.log("👁️ Signup modal visible:", signupVisible);
console.log("👁️ Main app visible:", appVisible);

// 4. Expected behavior analysis
console.log("\n📋 EXPECTED BEHAVIOR:");
if (isLoggedIn) {
    console.log("✅ Should show: Main app");
    console.log("❌ Should hide: Auth modals");
    
    if (appVisible && !loginVisible && !signupVisible) {
        console.log("🎉 CORRECT: App is shown, modals are hidden");
    } else {
        console.log("🚨 ISSUE: Authentication state doesn't match UI state");
    }
} else {
    console.log("✅ Should show: Login modal (or signup if URL is /signup)");
    console.log("❌ Should hide: Main app");
    
    if (currentPath === "/signup") {
        if (signupVisible && !loginVisible && !appVisible) {
            console.log("🎉 CORRECT: Signup modal shown");
        } else {
            console.log("🚨 ISSUE: Should show signup modal");
        }
    } else {
        if (loginVisible && !signupVisible && !appVisible) {
            console.log("🎉 CORRECT: Login modal shown");
        } else {
            console.log("🚨 ISSUE: Should show login modal");
        }
    }
}

// 5. Test API configuration
console.log("\n🌐 API CONFIGURATION:");
try {
    // Try to access config
    fetch('/config.js')
        .then(r => r.text())
        .then(config => {
            console.log("📄 Config loaded successfully");
            if (config.includes('API_BASE_URL')) {
                console.log("✅ API_BASE_URL configuration found");
            }
        })
        .catch(e => console.log("⚠️ Could not load config:", e));
} catch (e) {
    console.log("⚠️ Config check failed:", e);
}

// 6. Quick API test (if authenticated)
if (isLoggedIn && token) {
    console.log("\n🧪 TESTING API CONNECTION:");
    fetch('/api/users/me', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(r => r.ok ? r.json() : Promise.reject('API Error'))
    .then(user => console.log("✅ API working - User:", user.username))
    .catch(e => console.log("❌ API test failed:", e));
}

console.log("\n" + "=".repeat(50));
console.log("Copy this output to help debug any issues!");
