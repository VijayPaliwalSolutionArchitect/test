# SIS Mobile App - Complete Setup Guide

This guide will walk you through setting up the SIS Mobile app from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend API Setup](#backend-api-setup)
4. [Firebase Configuration](#firebase-configuration)
5. [Third-Party Services](#third-party-services)
6. [Running the App](#running-the-app)
7. [Building & Deployment](#building--deployment)
8. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Git**: ([Download](https://git-scm.com/))
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`

### For iOS Development (macOS only)

- **Xcode**: Latest version from App Store
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator**: Included with Xcode

### For Android Development

- **Android Studio**: ([Download](https://developer.android.com/studio))
- **Android SDK**: API Level 31+ (installed via Android Studio)
- **Android Emulator**: Set up via Android Studio AVD Manager

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourorg/sis-mobile-app.git
cd sis-mobile-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# API Configuration
API_BASE_URL=https://api.shivamitcs.in
API_TIMEOUT=30000
SIGNALR_HUB_URL=https://api.shivamitcs.in/hubs

# Environment
APP_ENV=development

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_BIOMETRIC_AUTH=true
ENABLE_DARK_MODE=true
```

## 🔌 Backend API Setup

### 1. Verify Backend API

Ensure your backend API is running at `https://api.shivamitcs.in`.

Check Swagger documentation:
```
https://api.shivamitcs.in/swagger/index.html
```

### 2. Test API Connection

```bash
# Test login endpoint
curl -X POST https://api.shivamitcs.in/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"password123"}'
```

### 3. Update API URLs

If your backend is on a different URL, update in:
- `.env` file
- `src/api/baseApi.ts` (if needed)

## 🔥 Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "SIS Mobile"
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Add Android App

1. In Firebase Console, click "Add app" → Android
2. Register app with package name: `com.shivamitcs.sismobile`
3. Download `google-services.json`
4. Place it in: `android/app/google-services.json`

### 3. Add iOS App

1. In Firebase Console, click "Add app" → iOS
2. Register app with bundle ID: `com.shivamitcs.sismobile`
3. Download `GoogleService-Info.plist`
4. Place it in: `ios/SISMobile/GoogleService-Info.plist`

### 4. Enable Firebase Services

In Firebase Console, enable:

- **Authentication**: Email/Password, Phone (optional)
- **Cloud Messaging**: For push notifications
- **Analytics**: For user behavior tracking
- **Crashlytics**: For crash reporting

### 5. Get Firebase Config

From Firebase Console → Project Settings:

```env
# Android
FIREBASE_ANDROID_API_KEY=AIzaSy...
FIREBASE_ANDROID_PROJECT_ID=sis-mobile
FIREBASE_ANDROID_APP_ID=1:123456789:android:abc123
FIREBASE_ANDROID_MESSAGING_SENDER_ID=123456789

# iOS
FIREBASE_IOS_API_KEY=AIzaSy...
FIREBASE_IOS_PROJECT_ID=sis-mobile
FIREBASE_IOS_APP_ID=1:123456789:ios:xyz789
FIREBASE_IOS_MESSAGING_SENDER_ID=123456789
```

Add these to `.env` file.

### 6. Get FCM Server Key

1. Firebase Console → Project Settings → Cloud Messaging
2. Copy "Server key"
3. Add to backend API configuration (for sending push notifications)

## 🌐 Third-Party Services

### SMS Service (Twilio - Recommended)

1. Sign up at [https://www.twilio.com](https://www.twilio.com)
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Configure in backend API

**Alternative for India**: MSG91 ([https://msg91.com](https://msg91.com))

### Email Service (SendGrid - Recommended)

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create API key with "Mail Send" permissions
3. Verify sender domain/email
4. Configure in backend API

### Payment Gateway (Razorpay for India)

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Get Key ID and Secret from Dashboard
4. Configure webhook URL in dashboard
5. Add credentials to `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_...
```

**Alternative Global**: Stripe ([https://stripe.com](https://stripe.com))

### File Storage (AWS S3)

1. Create AWS account
2. Create S3 bucket (e.g., `sis-mobile-uploads`)
3. Set bucket policy to private
4. Create IAM user with S3 permissions
5. Generate access key pair
6. Add to `.env`:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=sis-mobile-uploads
```

### Error Tracking (Sentry)

1. Sign up at [https://sentry.io](https://sentry.io)
2. Create new React Native project
3. Get DSN from Project Settings
4. Add to `.env`:

```env
SENTRY_DSN=https://...@sentry.io/...
```

5. Run Sentry wizard for setup:

```bash
npx @sentry/wizard@latest -i reactNative
```

## 📱 Running the App

### Development Mode

```bash
# Start Expo dev server
npm start

# Or with specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### Using Expo Go (Quick Testing)

1. Install Expo Go on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan QR code shown in terminal

### First Run Checklist

- [ ] Can see splash screen
- [ ] Login screen loads
- [ ] Can enter credentials
- [ ] Login button works
- [ ] No console errors

## 🏗 Building & Deployment

### Setup EAS Build

1. Create Expo account at [https://expo.dev](https://expo.dev)

2. Login to EAS:

```bash
eas login
```

3. Configure project:

```bash
eas init
```

4. Update `eas.json` with your project ID

### Build for Testing

```bash
# Android APK for testing
eas build --platform android --profile preview

# iOS build for TestFlight
eas build --platform ios --profile preview
```

### Production Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### Submit to Stores

```bash
# Android (requires google-play-service-account.json)
eas submit --platform android

# iOS (requires Apple Developer account)
eas submit --platform ios
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues

```bash
npm start -- --reset-cache
```

#### 2. Pod Install Fails (iOS)

```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### 3. Gradle Build Fails (Android)

```bash
cd android
./gradlew clean
cd ..
```

#### 4. "Cannot connect to Metro"

- Ensure you're on the same WiFi network
- Check firewall settings
- Try: `expo start --tunnel`

#### 5. "Module not found" errors

```bash
rm -rf node_modules
npm install
```

### Get Help

- GitHub Issues: [Create Issue](https://github.com/yourorg/sis-mobile-app/issues)
- Email Support: support@shivamitcs.in
- Documentation: Check `README.md` and `ThirdPartySettings.json`

## ✅ Verification Checklist

Before going to production:

- [ ] All third-party services configured
- [ ] Backend API tested and accessible
- [ ] Firebase push notifications working
- [ ] Payment gateway tested (in test mode)
- [ ] File uploads working
- [ ] Offline mode tested
- [ ] All roles (student, teacher, admin) tested
- [ ] Analytics tracking events
- [ ] Sentry capturing errors
- [ ] App icons and splash screen configured
- [ ] App store metadata prepared

## 🎉 Next Steps

1. **Customize Branding**: Update app icon, splash screen, theme colors
2. **Test All Features**: Go through each role's functionality
3. **Setup CI/CD**: Configure GitHub Actions for automated builds
4. **Prepare Store Listings**: Screenshots, descriptions, keywords
5. **Beta Testing**: Distribute to test users via TestFlight/Play Store Beta

---

**Need Help?** Contact support@shivamitcs.in or refer to [ThirdPartySettings.json](./ThirdPartySettings.json) for detailed service setup instructions.
