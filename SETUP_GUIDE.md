# Anil Sweets Corner - Complete E-Commerce App Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g expo-cli`
- Android/iPhone device or emulator
- Firebase project (free tier works)

### 1. Installation
```bash
cd AniilSweetsCorner
npm install
```

### 2. Firebase Setup (CRITICAL)
1. Go to [Firebase Console](https://firebase.google.com)
2. Create a new project
3. Enable **Authentication** > **Email/Password**
4. Create **Firestore Database** (Start in test mode for development)
5. Go to Project Settings > General > Copy your config

### 3. Configure Environment Variables
```bash
# Create .env file in project root with your Firebase config:
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### 4. Firestore Security Rules (Development)
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /orders/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Public product catalog
    match /products/{document=**} {
      allow read: if true;
    }
  }
}
```

### 5. Run the App
```bash
# Android
npm run android

# iOS
npm run ios

# Web (development only)
npm run web
```

---

## 📱 User Flow

### 1. **Authentication**
- Sign up with email, name, and phone
- Sign in to access the app
- Passwords stored securely via Firebase Auth

### 2. **Browse Products**
- Home screen with featured products & categories
- Filter by category (Ladoo, Barfi, Bengali, etc.)
- Search products
- View detailed product information

### 3. **Shopping Cart**
- Add/remove items
- Adjust quantities
- Real-time price calculations
- Persistent cart (saved to Firebase)

### 4. **Checkout**
- Delivery/Pickup selection
- Address management
- Special instructions
- Order summary with breakdown

### 5. **Payment**
- Choose payment method:
  - **Paytm UPI** (Real integration in production)
  - **Google Pay/PhonePe** (UPI)
  - **Cash on Delivery**
- Secure payment processing
- Order confirmation

### 6. **Order Tracking**
- Real-time order status updates
- Estimated delivery time
- Order history in profile
- Track multiple orders

---

## 🏗️ Architecture

### State Management
- **AuthContext** - User authentication & profile
- **CartContext** - Shopping cart operations
- **OrderContext** - Order creation & tracking

### Backend (Firebase)
```
Firestore Collections:
├── users/{userId}
│   ├── displayName, email, phone
│   ├── addresses[] (saved delivery addresses)
│   └── orders/{orderId} (order history)
├── products (product catalog)
└── orders (analytics/admin)
```

### Navigation
- **Auth Stack** - Login/Register screens
- **App Stack** - Home, Products, Cart, Checkout, Tracking
- **Profile** - User account & orders

---

## 🎨 Theme & Branding
- **Primary Color**: #FF6B00 (Orange)
- **Background**: #FFF8F0 (Cream)
- **Consistent UI** across all screens
- **Responsive design** for all device sizes

---

## ✅ Features Implemented

### ✔️ Complete
- User authentication (Email/Password)
- Product browsing & filtering
- Shopping cart management
- Order checkout with address
- Payment method selection
- Order tracking with status updates
- User profile & order history
- Responsive design (all screen sizes)
- Professional UI/UX
- Form validation
- Error handling

### 🔄 Demo Features
- Payment processing (simulated 2-second delay)
- Order status progression (30-second intervals)
- Mock product data (replace with Firestore)

---

## 🔐 Security Notes

### Development
- Firestore rules in test mode (public read/write)
- Firebase Emulator recommended for local testing

### Production
- Implement Firestore security rules
- Enable Firebase App Check
- Use environment variables for sensitive data
- Implement backend Firebase Functions for payment processing
- Enable reCAPTCHA on login

---

## 📊 Testing Credentials

### Demo Account
- Email: `demo@anil-sweets.com`
- Password: `demo123456`

*(Create your own account in development)*

---

## 🚀 Production Deployment

### Steps
1. Implement Firebase security rules
2. Setup Paytm/UPI payment gateway
3. Enable phone OTP authentication
4. Setup Firebase Hosting/Backend API
5. Configure domain & SSL
6. Setup CI/CD pipeline
7. Analytics & monitoring

### Paytm Integration
```typescript
// Requires:
// - Paytm Merchant ID & Key
// - Paytm SDK (native module)
// - Backend endpoint for secure checksum
```

---

## 🐛 Troubleshooting

### Firebase Connection Issues
```bash
# Check if Firebase config is correct
# Verify Firestore is enabled
# Check security rules allow your requests
# Look at browser DevTools > Network tab
```

### Build Issues
```bash
npm install  # Reinstall dependencies
npx expo prebuild --clean  # Rebuild native modules
npm start -- --reset-cache  # Clear Expo cache
```

### Performance
- Images hosted on Unsplash (CDN)
- Firestore indexes auto-created
- Cache products locally with AsyncStorage

---

## 📞 Support

- **Firebase Docs**: https://firebase.google.com/docs
- **React Native**: https://reactnative.dev
- **Expo**: https://docs.expo.dev

---

## 📄 License

This is a demo/educational project. Free to use for learning and commercial purposes.

---

**Built with ❤️ using React Native + Firebase + TypeScript**
