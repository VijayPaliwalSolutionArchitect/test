# Upgrade Guide - React Native 0.76.5 + Expo SDK 52

## 🎉 What's New

Your SIS Mobile App has been upgraded to:

- ✅ **React Native 0.76.5** (latest stable)
- ✅ **Expo SDK 52** (latest)
- ✅ **New Architecture Ready** (TurboModules & Fabric)
- ✅ **All dependencies updated** to latest compatible versions

## 🔧 Setup Instructions

### 1. Clean Install

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Clear caches
npx expo start -c

# Install fresh dependencies
npm install
```

### 2. Add Required Assets

Create these files in the `/assets` folder:

**Required Files:**
```
assets/
  ├── icon.png (1024x1024 px)
  ├── adaptive-icon.png (1024x1024 px)
  ├── splash.png (2048x2048 px)
  ├── notification-icon.png (96x96 px)
  └── favicon.png (48x48 px)
```

**Quick placeholders** (for testing):
```bash
# You can use placeholder images temporarily
# Download from: https://via.placeholder.com/1024x1024.png
```

### 3. Firebase Setup

**For Android:**
1. Download `google-services.json` from Firebase Console
2. Place it in the root: `/workspace/google-services.json`

**For iOS:**
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place it in the root: `/workspace/GoogleService-Info.plist`

**Template files provided:**
- `google-services.json.example`
- `GoogleService-Info.plist.example`

### 4. Environment Setup

Ensure your `.env` file has all required variables:

```env
API_BASE_URL=https://api.shivamitcs.in
SIGNALR_HUB_URL=https://api.shivamitcs.in/hubs
APP_ENV=development
```

## 🚀 Running the App

### Method 1: Expo Go (Quick Test)

```bash
# Start development server
npm start

# Scan QR code with Expo Go app on your phone
```

### Method 2: Development Build (Full Features)

```bash
# For Android
npx expo run:android

# For iOS (macOS only)
npx expo run:ios
```

### Method 3: Prebuild (if you need native code)

```bash
# Generate native folders
npx expo prebuild

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🐛 Troubleshooting

### Error: "TurboModuleRegistry.getEnforcing"

**Solution:**
```bash
# Clear all caches
npm start -- --reset-cache

# Or restart with clean slate
rm -rf node_modules .expo
npm install
npm start -c
```

### Error: "Module not found"

**Solution:**
```bash
# Clear Metro cache
npx expo start -c

# Reset cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "Could not find expo-modules-core"

**Solution:**
```bash
# Reinstall expo packages
npx expo install --fix
```

### Firebase Issues

**Solution:**
```bash
# Make sure Firebase config files exist:
ls -la google-services.json
ls -la GoogleService-Info.plist

# If missing, download from Firebase Console
```

### Android Build Fails

**Solution:**
```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..

# Or regenerate android folder
rm -rf android
npx expo prebuild --platform android
```

### iOS Build Fails

**Solution:**
```bash
# Clear iOS build cache
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Or regenerate ios folder
rm -rf ios
npx expo prebuild --platform ios
```

## 📦 Key Changes from 0.74 → 0.76.5

### Breaking Changes

1. **New Architecture Support**
   - TurboModules enabled by default
   - Fabric renderer available
   - Better performance

2. **Metro Bundler Update**
   - New metro config format
   - Better tree shaking
   - Faster bundling

3. **Expo Router v4**
   - Improved file-based routing
   - Better deep linking
   - New navigation patterns

### Migration Steps

✅ **Already Done:**
- Updated all package versions
- Fixed babel config (reanimated plugin moved to end)
- Updated metro.config.js
- Fixed app.json structure
- Added new arch flags
- Updated TypeScript config

✅ **You Need to Do:**
- Add icon/splash assets
- Add Firebase config files
- Test on real devices
- Update any custom native code (if any)

## 🎯 New Features Available

### 1. New Architecture (Optional)

Enable in `app.json`:
```json
{
  "ios": {
    "newArchEnabled": true
  },
  "android": {
    "newArchEnabled": true
  }
}
```

### 2. Expo Router Improvements

Better navigation with new hooks:
```typescript
import { useNavigation, useLocalSearchParams } from 'expo-router';
```

### 3. Performance Improvements

- Faster app startup
- Better memory management
- Improved JavaScript engine (Hermes)

## ✅ Verification Checklist

After upgrade, verify:

- [ ] App starts without errors
- [ ] Login works
- [ ] Navigation works (all tabs)
- [ ] API calls work
- [ ] Redux state works
- [ ] Push notifications work (after Firebase setup)
- [ ] File uploads work
- [ ] Offline mode works
- [ ] Theme switching works
- [ ] Multi-language works

## 🆘 Still Having Issues?

### 1. Nuclear Option (Complete Reset)

```bash
# Delete everything and start fresh
rm -rf node_modules package-lock.json .expo ios android
npm install
npx expo prebuild
npm start -c
```

### 2. Check Logs

```bash
# See detailed logs
npx expo start --clear

# Check for errors in terminal
```

### 3. Verify Installation

```bash
# Check Expo CLI version
npx expo --version
# Should be 52.x.x or higher

# Check Node version
node --version
# Should be 18.x or higher

# Check npm version
npm --version
# Should be 9.x or higher
```

## 📞 Support

If you still face issues:

1. Check error logs carefully
2. Search on [Expo Forums](https://forums.expo.dev/)
3. Check [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
4. Create issue on GitHub with full error logs

## 🎉 Success!

Once you see the login screen without errors, you're good to go! 

The app is now running on:
- ✅ React Native 0.76.5
- ✅ Expo SDK 52
- ✅ Latest compatible dependencies
- ✅ Ready for production

---

**Next Steps:**
1. Add your app icons and splash screen
2. Add Firebase configuration files
3. Test all features thoroughly
4. Build and deploy!
