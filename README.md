# SIS Mobile - School Information System Mobile App

A comprehensive cross-platform mobile application for School Information System built with React Native, Expo, and TypeScript.

## 🚀 Features

### For Students
- 📊 **Dashboard** - View upcoming classes, pending assignments, and attendance summary
- 📅 **Timetable** - Daily and weekly class schedule
- 📝 **Assignments** - Submit assignments, view grades and feedback
- 📈 **Exams & Results** - View exam schedules and results
- 💰 **Fees** - Check fee status and make payments
- 🔔 **Notifications** - Real-time updates and announcements
- 💬 **Messaging** - Chat with teachers and classmates

### For Teachers
- 👥 **Class Management** - Manage multiple classes and sections
- ✅ **Attendance** - Quick attendance marking with QR/geo-fencing
- 📝 **Assignments** - Create, distribute, and grade assignments
- 📊 **Performance Analytics** - Track student performance
- 📢 **Announcements** - Send notifications to students/parents

### For Admins
- 🏫 **School Management** - Manage users, classes, and subjects
- 📊 **Reports & Analytics** - Comprehensive system reports
- 💳 **Fee Management** - Billing, payments, and reconciliation
- 📢 **Broadcast Notifications** - School-wide announcements
- ⚙️ **System Configuration** - Academic year, holidays, settings

### For Parents
- 👨‍👩‍👧 **Child Monitoring** - View children's academic progress
- 🔔 **Notifications** - Get updates about child's activities
- 💬 **Communication** - Chat with teachers and admin

## 🛠 Tech Stack

- **Framework:** React Native 0.76.5 + Expo SDK 52 + TypeScript
- **State Management:** Redux Toolkit + RTK Query
- **Navigation:** Expo Router v4 (file-based routing)
- **UI/Styling:** Custom theme system (Tailwind-inspired)
- **Real-time:** SignalR for live updates
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Offline Storage:** MMKV + Realm
- **File Uploads:** AWS S3 with presigned URLs
- **Payments:** Razorpay (India) / Stripe (Global)
- **Analytics:** Firebase Analytics + Sentry
- **i18n:** i18next (English, Hindi, Gujarati)
- **CI/CD:** GitHub Actions + EAS Build
- **New Architecture:** TurboModules & Fabric Ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (macOS) or Android Studio (for Android development)
- Firebase project (for push notifications)
- AWS account (for file storage) OR Azure Blob Storage

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/sis-mobile-app.git
   cd sis-mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - API_BASE_URL (your backend API)
   - Firebase credentials
   - Sentry DSN
   - AWS/Azure credentials
   - Payment gateway keys

4. **Setup Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Add Android app and download `google-services.json`
   - Add iOS app and download `GoogleService-Info.plist`
   - Enable Cloud Messaging, Analytics, and Crashlytics

5. **Configure EAS**
   ```bash
   eas init
   ```

## 🚀 Running the App

### ⚠️ IMPORTANT: First Time Setup

**Before running, you need:**

1. **Add App Icons** (see `/assets/.gitkeep` for requirements)
2. **Add Firebase Config Files:**
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
   - See examples: `google-services.json.example` and `GoogleService-Info.plist.example`

### Development Mode

```bash
# Clean install (RECOMMENDED FIRST TIME)
rm -rf node_modules package-lock.json
npm install

# Start with clear cache
npm start

# Or clear cache manually
npx expo start -c

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Preview Build

```bash
# Build for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

### Production Build

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## 📱 App Structure

```
/workspace
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication flow
│   ├── (app)/             # Authenticated app screens
│   │   └── (tabs)/        # Bottom tab navigation
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── api/               # API configuration
│   ├── assets/            # Images, fonts, icons
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature modules
│   ├── hooks/             # Custom React hooks
│   ├── locales/           # i18n translations
│   ├── navigation/        # Navigation config
│   ├── screens/           # Screen components
│   ├── services/          # External services
│   ├── store/             # Redux store & slices
│   │   └── slices/        # RTK Query APIs
│   ├── styles/            # Style utilities
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── theme.config.ts        # Centralized theme config
├── ThirdPartySettings.json # Third-party service docs
└── package.json
```

## 🎨 Theme Customization

The app uses a centralized theme configuration system. Edit `theme.config.ts` to customize:

- **Colors** - Primary, secondary, success, error, etc.
- **Typography** - Font families, sizes, weights
- **Spacing** - Consistent spacing scale
- **Shadows** - Elevation and shadows
- **Border Radius** - Rounded corners
- **Components** - Button, input, card sizes

```typescript
// theme.config.ts
export const themeConfig = {
  colors: {
    primary: { 500: '#a855f7', 600: '#9333ea' },
    // ... more colors
  },
  typography: {
    fontSize: { base: 16, lg: 18 },
    // ... more typography
  },
  // ... more config
};
```

## 🔐 Authentication Flow

1. User enters email/phone and password
2. Backend validates credentials and returns JWT tokens
3. Access token and refresh token stored securely (Keychain/Keystore)
4. Access token included in API requests
5. Auto-refresh when access token expires
6. Biometric authentication (optional, Face ID/Touch ID)

## 📡 API Integration

The app communicates with the backend API at `https://api.shivamitcs.in`

API documentation (Swagger): https://api.shivamitcs.in/swagger/index.html

All API calls are managed through RTK Query:

```typescript
// Example: Fetch assignments
const { data, isLoading, error } = useGetAssignmentsQuery({
  classId: '10A',
  status: 'pending',
});
```

## 🔄 Offline Support

- **MMKV** for fast key-value storage
- **Realm** for offline database
- **AsyncStorage** for large data persistence
- Automatic sync when online
- Queued actions for offline submissions

## 🔔 Push Notifications

Firebase Cloud Messaging (FCM) is used for push notifications:

1. User grants notification permission on first launch
2. FCM token generated and sent to backend
3. Backend sends notifications via FCM
4. App displays notification (even when closed)
5. Tapping notification navigates to relevant screen

## 📊 Analytics & Monitoring

- **Firebase Analytics** - User behavior and engagement
- **Sentry** - Error tracking and crash reporting
- **Custom Events** - Login, assignment submit, payment, etc.

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests (Detox)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🚢 Deployment

### Over-the-Air (OTA) Updates

```bash
# Publish OTA update (JS-only changes)
eas update --branch production
```

### App Store Submission

```bash
# iOS
npm run submit:ios

# Android
npm run submit:android
```

## 🔧 Third-Party Services Setup

See `ThirdPartySettings.json` for detailed setup instructions for:

- **SMS** - Twilio, MSG91
- **Email** - SendGrid, AWS SES
- **Payments** - Razorpay, Stripe
- **Storage** - AWS S3, Azure Blob
- **Video Calls** - Agora, Twilio Video (optional)
- **Maps** - Google Maps (for transport tracking)

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```bash
# API
API_BASE_URL=https://api.shivamitcs.in
SIGNALR_HUB_URL=https://api.shivamitcs.in/hubs

# Firebase
FIREBASE_ANDROID_API_KEY=...
FIREBASE_IOS_API_KEY=...

# Sentry
SENTRY_DSN=...

# AWS S3
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Payments
RAZORPAY_KEY_ID=...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Shivam IT Solutions** - [https://shivamitcs.in](https://shivamitcs.in)

## 🆘 Support

For issues, questions, or feature requests:
- Email: support@shivamitcs.in
- GitHub Issues: [Create an issue](https://github.com/yourorg/sis-mobile-app/issues)

## 📚 Additional Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup instructions
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[Project Summary](./PROJECT_SUMMARY.md)** - Complete project overview
- **[Third Party Settings](./ThirdPartySettings.json)** - Service integration guide
- **[API Documentation](https://api.shivamitcs.in/swagger/index.html)** - Backend API docs

---

**Happy Coding!** 🎉
