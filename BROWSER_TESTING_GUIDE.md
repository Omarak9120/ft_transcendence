# Browser Manual Testing Guide - ft_transcendence

## 🎯 **Critical Frontend Testing Steps**

**Prerequisites**:

- All containers running: `docker ps` shows nginx, frontend, backend
- Access via: `http://localhost`
- Test user created: email `test@example.com`, password `TestPass123!`

---

## 📋 **STEP 1: Authentication Modal Testing**

### 1.1 Initial Load Test

1. **Navigate to**: `http://localhost`
2. **Expected**: Login modal should appear (not authenticated)
3. **Check**: URL should show `/` in address bar
4. **Check**: Page background shows login overlay, main app hidden

### 1.2 Login Modal Functionality

1. **Click**: Login form fields to test focus/styling
2. **Enter**: Invalid email → should show validation
3. **Enter**: Valid email `test@example.com`
4. **Enter**: Invalid password → should show error after submit
5. **Enter**: Valid password `TestPass123!`
6. **Click**: Login button
7. **Expected**: Modal disappears, main app appears
8. **Check**: localStorage should contain `token` and `user`

### 1.3 Signup Modal Testing

1. **Refresh page** (to reset auth state)
2. **Click**: "Sign up" link in login modal
3. **Expected**: Login modal disappears, signup modal appears
4. **Check**: URL should change to `/signup`
5. **Fill form**: Username, email, password, confirm password
6. **Test**: Password validation (weak password should show error)
7. **Submit**: Valid signup data
8. **Expected**: Success message or redirect to login

### 1.4 Modal Navigation

1. **Direct URL**: Navigate to `http://localhost/login`
2. **Expected**: Login modal appears
3. **Direct URL**: Navigate to `http://localhost/signup`
4. **Expected**: Signup modal appears
5. **Browser Back/Forward**: Test history navigation
6. **Expected**: Modals respond to browser navigation

---

## 📋 **STEP 2: SPA Routing Testing**

### 2.1 Authenticated Routing

1. **Login successfully** (if not already logged in)
2. **Navigate to**: `http://localhost/profile`
3. **Expected**: Profile page loads without page refresh
4. **Navigate to**: `http://localhost/friends`
5. **Expected**: Friends page loads
6. **Navigate to**: `http://localhost/stats`
7. **Expected**: Stats page loads
8. **Check**: All navigation happens without full page reloads

### 2.2 Deep Linking

1. **Copy URL** of any page (e.g., `/profile`)
2. **Open in new tab**: Paste URL
3. **Expected**: If authenticated, page loads directly
4. **Test**: Open `/profile` in incognito (not authenticated)
5. **Expected**: Should redirect to login

### 2.3 Browser Navigation

1. **Navigate**: Home → Profile → Friends → Stats
2. **Use Browser Back**: Should go Stats → Friends → Profile → Home
3. **Use Browser Forward**: Should navigate forward correctly
4. **Check**: URL bar always reflects current page

---

## 📋 **STEP 3: API Integration Testing**

### 3.1 Browser Console Testing

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Copy/paste the browser test script** from `browser_auth_test.js`
4. **Run the script**
5. **Expected**: All API tests should show ✅ WORKING

### 3.2 Network Tab Monitoring

1. **Open Network tab** in Developer Tools
2. **Clear requests** and start monitoring
3. **Perform login**
4. **Check**: Should see `POST /login` with 200 response
5. **Navigate to profile**
6. **Check**: Should see `GET /api/users/me` with 200 response
7. **Verify**: All API calls use relative URLs (no localhost:3000)

### 3.3 LocalStorage Testing

1. **Open Application/Storage tab** in Developer Tools
2. **Navigate to LocalStorage** → localhost
3. **After login, check**:
   - `token`: Should contain JWT token
   - `user`: Should contain user object
4. **Clear localStorage**
5. **Refresh page**
6. **Expected**: Should be redirected to login modal

---

## 📋 **STEP 4: Core Feature Testing**

### 4.1 Profile Page

1. **Navigate to profile**
2. **Check**: User information displays correctly
3. **Test**: Edit profile functionality
4. **Test**: Avatar upload (if implemented)
5. **Check**: Changes persist after page refresh

### 4.2 Friends System

1. **Navigate to friends page**
2. **Test**: Add friend functionality
3. **Test**: Friend requests (send/receive)
4. **Check**: Friends list displays
5. **Test**: Friend statistics view

### 4.3 Game Features

1. **Navigate to game section**
2. **Test**: Game lobby access
3. **Test**: Game creation/joining
4. **Check**: Real-time updates work
5. **Test**: Game history display

### 4.4 Notifications

1. **Check**: Notification area/bell icon
2. **Test**: Notification display
3. **Test**: Mark as read functionality
4. **Check**: Real-time notification updates

---

## 📋 **STEP 5: Error Handling Testing**

### 5.1 Network Error Simulation

1. **Stop backend container**: `docker stop ft_transcendence-backend-1`
2. **Try to login**
3. **Expected**: Should show network error message
4. **Restart backend**: `docker start ft_transcendence-backend-1`
5. **Test**: Recovery after backend restart

### 5.2 Invalid Token Testing

1. **Login successfully**
2. **Manually edit token** in localStorage (corrupt it)
3. **Try to access protected page**
4. **Expected**: Should redirect to login
5. **Check**: Error message should be user-friendly

### 5.3 Server Error Testing

1. **Try invalid API requests** through console
2. **Check**: Error messages are handled gracefully
3. **Test**: Form validation with various invalid inputs

---

## 📋 **STEP 6: WebSocket Testing**

### 6.1 Real-time Features

1. **Open two browser tabs/windows**
2. **Login to both** with different users
3. **Test**: Real-time notifications
4. **Test**: Game invitations/challenges
5. **Test**: Live game updates
6. **Check**: Changes appear instantly in both windows

---

## ✅ **SUCCESS CRITERIA**

**All tests pass if**:

- ✅ Authentication modals work smoothly
- ✅ SPA routing works without page refreshes
- ✅ All API calls return expected data
- ✅ Browser navigation (back/forward) works correctly
- ✅ Deep linking and direct URLs work
- ✅ Authentication state persists across page refreshes
- ✅ Error handling provides user-friendly messages
- ✅ Real-time features work correctly

---

## 🚨 **Common Issues to Check**

1. **Console Errors**: Check for JavaScript errors
2. **Network Failures**: Look for 404s or CORS errors
3. **Authentication Loops**: Login → logout → login issues
4. **Routing Problems**: URLs not updating or deep links failing
5. **Modal Issues**: Modals not appearing/disappearing correctly
6. **API Errors**: Backend routes returning unexpected responses

---

**Run this guide systematically to ensure the ft_transcendence application works correctly end-to-end.**
