// Frontend Authentication Test Script
// Run this in the browser console at http://localhost

console.log("🧪 Starting Frontend Authentication Tests...");

// Test 1: Check if API_BASE_URL is correctly configured
console.log("📋 Test 1: API Configuration");
try {
    const configScript = document.querySelector('script[src="config.js"]');
    console.log("✅ Config script found:", !!configScript);
    console.log("📄 Current page URL:", window.location.href);
    console.log("🔗 Expected to use relative URLs for API calls");
} catch (error) {
    console.error("❌ Config test failed:", error);
}

// Test 2: Check if auth modals exist and are properly structured
console.log("\n📋 Test 2: Authentication Modal Structure");
const loginOverlay = document.getElementById("login-overlay");
const signupOverlay = document.getElementById("signup-overlay");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

console.log("✅ Login overlay exists:", !!loginOverlay);
console.log("✅ Signup overlay exists:", !!signupOverlay);
console.log("✅ Login form exists:", !!loginForm);
console.log("✅ Signup form exists:", !!signupForm);

// Test 3: Check current authentication state
console.log("\n📋 Test 3: Authentication State");
const userToken = localStorage.getItem("token");
const userData = localStorage.getItem("user");
console.log("🔑 Token exists:", !!userToken);
console.log("👤 User data exists:", !!userData);
console.log("🔍 Current auth state:", userToken ? "AUTHENTICATED" : "NOT AUTHENTICATED");

// Test 4: Test login modal visibility
console.log("\n📋 Test 4: Modal Visibility");
const loginVisible = !loginOverlay?.classList.contains("hidden");
const signupVisible = !signupOverlay?.classList.contains("hidden");
console.log("👁️ Login modal visible:", loginVisible);
console.log("👁️ Signup modal visible:", signupVisible);

// Test 5: Simulate login API call (without actually submitting)
console.log("\n📋 Test 5: API Endpoint Test");
async function testLoginEndpoint() {
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "TestPass123!"
            })
        });
        
        const result = await response.json();
        console.log("🌐 Login API Response Status:", response.status);
        console.log("📊 Login API Response:", result);
        
        if (response.ok && result.token) {
            console.log("✅ Login API working correctly");
            return result;
        } else {
            console.log("⚠️ Login API returned error:", result);
            return null;
        }
    } catch (error) {
        console.error("❌ Login API test failed:", error);
        return null;
    }
}

// Test 6: Test signup API endpoint
async function testSignupEndpoint() {
    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "testuser" + Date.now(),
                email: "test" + Date.now() + "@example.com",
                password: "TestPass123!"
            })
        });
        
        const result = await response.json();
        console.log("🌐 Signup API Response Status:", response.status);
        console.log("📊 Signup API Response:", result);
        
        if (response.ok) {
            console.log("✅ Signup API working correctly");
            return result;
        } else {
            console.log("⚠️ Signup API returned error:", result);
            return null;
        }
    } catch (error) {
        console.error("❌ Signup API test failed:", error);
        return null;
    }
}

// Run the tests
console.log("\n🚀 Running API Tests...");
Promise.all([
    testLoginEndpoint(),
    testSignupEndpoint()
]).then(([loginResult, signupResult]) => {
    console.log("\n📊 Test Summary:");
    console.log("🔐 Login API:", loginResult ? "✅ WORKING" : "❌ FAILED");
    console.log("📝 Signup API:", signupResult ? "✅ WORKING" : "❌ FAILED");
    
    if (loginResult && loginResult.token) {
        console.log("\n🧪 Testing authentication flow...");
        // Simulate successful login
        localStorage.setItem("token", loginResult.token);
        if (loginResult.user) {
            localStorage.setItem("user", JSON.stringify(loginResult.user));
        }
        console.log("✅ Token stored in localStorage");
        console.log("🔄 Refresh the page to test authenticated state");
    }
});

// Test 7: Check for JavaScript errors
console.log("\n📋 Test 7: JavaScript Error Check");
window.addEventListener('error', (e) => {
    console.error("🚨 JavaScript Error:", e.error);
});

console.log("✅ All tests initiated. Check results above.");
