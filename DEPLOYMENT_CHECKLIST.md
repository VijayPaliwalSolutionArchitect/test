# SIS Mobile - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code & Configuration

- [ ] All environment variables configured correctly
- [ ] Production API URL updated in `.env`
- [ ] Remove all console.log statements (or use proper logging)
- [ ] Remove debug flags and test data
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings fixed
- [ ] Bundle size optimized

### ✅ Testing

- [ ] All features tested on iOS
- [ ] All features tested on Android
- [ ] Tested on different screen sizes
- [ ] Tested on slow network (3G)
- [ ] Tested offline functionality
- [ ] Tested push notifications
- [ ] Tested deep linking
- [ ] Payment flow tested (test mode)
- [ ] File uploads tested
- [ ] Role-based access tested (all roles)

### ✅ Third-Party Services

#### Firebase
- [ ] Firebase project created
- [ ] FCM configured for iOS
- [ ] FCM configured for Android
- [ ] Analytics enabled
- [ ] Crashlytics enabled
- [ ] Test notification sent successfully

#### Sentry
- [ ] Sentry project created
- [ ] DSN configured
- [ ] Source maps uploaded
- [ ] Test error captured

#### Payment Gateway
- [ ] Razorpay/Stripe account verified
- [ ] Test payments working
- [ ] Production keys obtained (don't use in app yet)
- [ ] Webhooks configured and tested

#### Storage
- [ ] AWS S3 bucket created
- [ ] Bucket permissions configured
- [ ] CORS policy set
- [ ] Presigned URL generation tested
- [ ] File upload tested

#### SMS & Email
- [ ] Twilio/SendGrid account setup
- [ ] Sender verification complete
- [ ] Test SMS sent
- [ ] Test email sent

### ✅ Security

- [ ] All API keys in environment variables
- [ ] `.env` added to `.gitignore`
- [ ] No hardcoded credentials
- [ ] JWT token expiry configured
- [ ] Refresh token rotation implemented
- [ ] API rate limiting configured (backend)
- [ ] Input validation implemented
- [ ] SQL injection prevention (backend)
- [ ] XSS prevention measures

### ✅ Performance

- [ ] Images optimized
- [ ] Large lists use FlatList
- [ ] API responses cached
- [ ] Offline data stored efficiently
- [ ] No memory leaks
- [ ] App startup time < 3 seconds
- [ ] Smooth scrolling (60 FPS)

### ✅ App Store Requirements

#### iOS (Apple App Store)

- [ ] Apple Developer account ($99/year)
- [ ] App icon (1024x1024 PNG)
- [ ] Launch screen/splash screen
- [ ] Screenshots (all required sizes)
- [ ] App description (4000 chars max)
- [ ] Keywords for ASO
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App category selected
- [ ] Age rating completed
- [ ] App review information provided
- [ ] Build uploaded to App Store Connect
- [ ] TestFlight testing completed

#### Android (Google Play Store)

- [ ] Google Play Developer account ($25 one-time)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (at least 2, max 8)
- [ ] App description (4000 chars max)
- [ ] Short description (80 chars max)
- [ ] Privacy policy URL
- [ ] App category selected
- [ ] Content rating completed
- [ ] Target audience selected
- [ ] Data safety form completed
- [ ] Signed APK/AAB generated
- [ ] Internal testing completed

### ✅ Documentation

- [ ] README.md updated
- [ ] SETUP_GUIDE.md reviewed
- [ ] API documentation current
- [ ] ThirdPartySettings.json updated
- [ ] CHANGELOG.md created
- [ ] User manual (optional)

### ✅ Legal & Compliance

- [ ] Privacy policy drafted
- [ ] Terms of service drafted
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy
- [ ] Cookie policy (web)
- [ ] User data deletion flow
- [ ] Parental consent (if users < 13)

### ✅ Monitoring & Analytics

- [ ] Firebase Analytics events defined
- [ ] Sentry error tracking active
- [ ] Performance monitoring enabled
- [ ] User engagement metrics tracked
- [ ] Crash-free rate monitored

### ✅ CI/CD

- [ ] GitHub Actions workflow configured
- [ ] Automated tests in CI pipeline
- [ ] Automated builds configured
- [ ] EAS Build credentials set
- [ ] Secrets stored securely
- [ ] Branch protection enabled

## Build & Submit

### iOS Submission

```bash
# 1. Build for production
eas build --platform ios --profile production

# 2. Submit to App Store
eas submit --platform ios

# 3. Monitor status
# Check App Store Connect for review status
```

### Android Submission

```bash
# 1. Build for production
eas build --platform android --profile production

# 2. Submit to Play Store
eas submit --platform android

# 3. Monitor status
# Check Google Play Console for review status
```

## Post-Deployment

### After App Store Approval

- [ ] Download app from store
- [ ] Test production app
- [ ] Verify all features work
- [ ] Check analytics tracking
- [ ] Verify push notifications
- [ ] Test payments (real transactions)
- [ ] Monitor error rates
- [ ] Monitor crash rates
- [ ] Check user feedback

### Marketing

- [ ] App Store Optimization (ASO)
- [ ] Social media announcement
- [ ] Email to existing users
- [ ] Press release (optional)
- [ ] App preview video
- [ ] Landing page updated

### Support

- [ ] Support email monitored
- [ ] FAQ page created
- [ ] User onboarding flow tested
- [ ] In-app help/support accessible

## Rollback Plan

If critical issues are found:

1. **Immediate:**
   - Pause new user signups if needed
   - Post notice in app (if possible)
   - Monitor error logs

2. **Fix:**
   - Identify and fix issue
   - Test thoroughly
   - Deploy hotfix

3. **OTA Update (for JS-only bugs):**
   ```bash
   eas update --branch production --message "Hotfix for..."
   ```

4. **New Store Version (for native bugs):**
   - Bump version number
   - Submit expedited review (if available)

## Version Management

### Versioning Scheme

Use Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: `1.2.3`

### Before Each Release

- [ ] Update version in `app.json`
- [ ] Update version in `package.json`
- [ ] Tag git commit: `git tag v1.2.3`
- [ ] Update CHANGELOG.md
- [ ] Create GitHub release

## Emergency Contacts

- **Backend Team**: backend@shivamitcs.in
- **DevOps**: devops@shivamitcs.in
- **Support**: support@shivamitcs.in
- **Emergency Hotline**: [PHONE_NUMBER]

---

**Last Updated**: 2025-10-30

**Release Manager**: [YOUR_NAME]

**Next Review Date**: [DATE]
