# Quick Start Guide - SIS Mobile App

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (2 min)

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Step 2: Add Placeholder Assets (1 min)

**Create placeholder icons** (or download from https://via.placeholder.com):

```bash
mkdir -p assets

# Download placeholder images (or create your own)
# For now, you can skip this and the app will use defaults
```

### Step 3: Add Firebase Config (1 min)

**Option A - Skip for Now (Recommended for Testing)**

Comment out Firebase plugins in `app.json`:

```json
"plugins": [
  "expo-router",
  // "@react-native-firebase/app",  <-- Comment these
  // "@react-native-firebase/crashlytics",
  // ... other plugins
]
```

**Option B - Add Real Firebase Config**

1. Download from Firebase Console
2. Save as:
   - `google-services.json` (root directory)
   - `GoogleService-Info.plist` (root directory)

### Step 4: Start the App (1 min)

```bash
# Start with clear cache
npm start -c

# Press 'a' for Android
# Press 'i' for iOS
# Or scan QR code with Expo Go app
```

## ✅ That's It!

You should now see the SIS Mobile login screen!

## 🐛 If You See Errors

### "Cannot find expo-modules-core"

```bash
npx expo install --fix
npm start -c
```

### "TurboModuleRegistry error"

```bash
npm start -- --reset-cache
```

### "Metro bundler crashed"

```bash
rm -rf .expo node_modules
npm install
npm start -c
```

### Firebase Errors

Either:
1. Add the config files (see Step 3 Option B)
2. Or comment out Firebase plugins (see Step 3 Option A)

## 📱 Test Login

Use these credentials (if backend is configured):

```
Email: test@example.com
Password: password123
```

Or configure your backend API URL in `.env`:

```env
API_BASE_URL=https://api.shivamitcs.in
```

## 🎯 Next Steps

1. ✅ Verify app runs
2. ✅ Add real app icons
3. ✅ Configure Firebase
4. ✅ Test all features
5. ✅ Build for production

## 📞 Need Help?

- Check `UPGRADE_GUIDE.md` for detailed troubleshooting
- Check `SETUP_GUIDE.md` for complete setup
- Email: support@shivamitcs.in

---

**Happy Coding! 🎉**
