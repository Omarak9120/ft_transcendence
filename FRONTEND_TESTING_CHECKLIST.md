# Frontend Testing Checklist - Phase 1

## 🔍 **IMMEDIATE TESTING TASKS**

### **Task 1: Authentication Modal Behavior** ⚡ START HERE

**URL**: `http://localhost`

**Expected Behavior**:

- [ ] Login modal appears immediately (since no user is authenticated)
- [ ] Background shows gradient overlay
- [ ] Main app content is hidden behind modal
- [ ] URL shows `/` in address bar

**Test Steps**:

1. **Visual Check**: Login modal visible with email/password fields
2. **Form Interaction**: Click email field → should show focus styling
3. **Validation Test**: Submit empty form → should show validation errors
4. **Switch to Signup**: Click "Sign up" link → signup modal should appear
5. **URL Check**: URL should change to `/signup` when signup modal opens

---

### **Task 2: Login Functionality Test** ⚡ CRITICAL

**Use Test Account**: `test@example.com` / `TestPass123!`

**Test Steps**:

1. **Enter Credentials**: Valid email and password
2. **Submit Form**: Click Login button
3. **Success Behavior Expected**:
   - [ ] Modal disappears
   - [ ] Main app becomes visible
   - [ ] URL changes to `/` (or stays at `/`)
   - [ ] No page refresh occurs
   - [ ] Navigation menu appears

**Failure Indicators**:

- ❌ Page refreshes (SPA broken)
- ❌ Modal stays visible after successful login
- ❌ Network errors in browser console
- ❌ Infinite loading or no response

---

### **Task 3: SPA Navigation Test** ⚡ CRITICAL

**Prerequisites**: Must be logged in from Task 2

**Test Navigation Links**:

- [ ] Profile → URL should become `/profile`
- [ ] Friends → URL should become `/friends`
- [ ] Stats/Leaderboard → URL should become `/stats`
- [ ] Notifications → Check if accessible

**Success Criteria**:

- ✅ URL changes without page refresh
- ✅ Content updates instantly
- ✅ Browser back/forward works correctly
- ✅ Direct URL access works (copy/paste URL in new tab)

---

### **Task 4: API Integration Test** ⚡ CRITICAL

**Prerequisites**: Must be logged in

**Browser Console Test**:

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Test API Call**:

```javascript
fetch("/api/users/me", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
})
  .then((r) => r.json())
  .then((data) => console.log("User data:", data))
  .catch((err) => console.error("API Error:", err));
```

**Expected Result**: Should log user object with id, username, email, etc.

---

### **Task 5: WebSocket Connection Test** ⚡ READY TO VERIFY

**Check Real-time Features**:

**Browser Console Test**:

```javascript
// Check if Socket.IO is connected
if (window.io) {
  console.log("Socket.IO available");
  // Test connection
  const socket = io();
  socket.on("connect", () => console.log("✅ WebSocket Connected"));
  socket.on("disconnect", () => console.log("❌ WebSocket Disconnected"));
} else {
  console.log("❌ Socket.IO not loaded");
}
```

---

## 🚨 **Common Issues to Watch For**

### Authentication Issues:

- Modal doesn't appear on page load
- Login form doesn't submit or shows network errors
- Page refreshes instead of SPA behavior
- Token not stored in localStorage

### SPA Routing Issues:

- URLs don't change during navigation
- Direct URLs (deep links) don't work
- Browser back/forward broken
- Page refreshes during navigation

### API Integration Issues:

- 404 errors on API calls
- CORS errors in console
- Token not being sent with requests
- Relative URLs not working

---

## ✅ **Success Criteria Checklist**

- [ ] **Authentication**: Login modal works, credentials accepted
- [ ] **SPA Routing**: Navigation works without page refresh
- [ ] **URL Handling**: Direct links and browser navigation work
- [ ] **API Calls**: Frontend successfully communicates with backend
- [ ] **Token Management**: JWT stored and used correctly
- [ ] **WebSocket**: Real-time connection established
- [ ] **Error Handling**: User-friendly error messages displayed

---

**🎯 Start with Task 1 and work through systematically. Report any issues immediately.**
