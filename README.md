# 🍬 Anil Sweets Corner — React Native (Expo) App

A beautiful Indian sweets ordering app built with React Native (Expo), pixel-perfectly matching the provided Figma designs.

---

## 📱 Screens

| Screen | File |
|--------|------|
| Splash | `app/SplashScreen.js` |
| Home | `app/HomeScreen.js` |
| Product List | `app/ProductListScreen.js` |
| Product Detail | `app/ProductDetailScreen.js` |
| Cart | `app/CartScreen.js` |
| Checkout | `app/CheckoutScreen.js` |
| Order Success | `app/OrderSuccessScreen.js` |

---

## 🧱 Components

| Component | File | Description |
|-----------|------|-------------|
| `ProductCard` | `components/ProductCard.js` | Grid card for home screen |
| `ProductListItem` | `components/ProductListItem.js` | Row card for list screen |
| `CartItem` | `components/CartItem.js` | Cart row with qty controls |
| `CategoryChip` | `components/CategoryChip.js` | Pill filter chip |
| `Header` | `components/Header.js` | HomeHeader + ScreenHeader |
| `SearchBar` | `components/SearchBar.js` | Search input with filter btn |
| `PrimaryButton` | `components/PrimaryButton.js` | Reusable CTA button |
| `BottomTabBar` | `components/BottomTabBar.js` | Tab navigation bar |

---

## 🎨 Design System

```
Colors:
  Primary:    #FF6B00
  Background: #FFF8F0
  Card:       #FFFFFF
  Text:       #222222
  Muted:      #777777

Border Radius:
  Cards:    18
  Buttons:  16
  Chips:    999 (pill)

Spacing: 8, 12, 16, 20, 24
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npx expo start

# 3. Scan QR code with Expo Go app (iOS/Android)
#    OR press 'i' for iOS simulator / 'a' for Android emulator
```

---

## 📦 Tech Stack

- **React Native** (Expo SDK 51)
- **Expo Router** compatible structure
- **React Navigation** (Stack)
- **@expo/vector-icons** (Ionicons)
- **React Context API** — Global cart state
- **Functional Components** + Hooks throughout

---

## 📁 Folder Structure

```
AniilSweetsCorner/
├── App.js                     ← Root navigator + providers
├── app.json                   ← Expo config
├── babel.config.js
├── app/
│   ├── SplashScreen.js
│   ├── HomeScreen.js
│   ├── ProductListScreen.js
│   ├── ProductDetailScreen.js
│   ├── CartScreen.js
│   ├── CheckoutScreen.js
│   └── OrderSuccessScreen.js
├── components/
│   ├── PrimaryButton.js
│   ├── Header.js
│   ├── SearchBar.js
│   ├── CategoryChip.js
│   ├── ProductCard.js
│   ├── ProductListItem.js
│   ├── CartItem.js
│   └── BottomTabBar.js
├── constants/
│   ├── theme.js               ← Colors, Spacing, Radius, Typography
│   └── CartContext.js         ← Global cart state (Context API)
└── data/
    └── mockData.js            ← Products, categories, reviews
```

---

## 🔥 Features

- ✅ Animated Splash Screen
- ✅ Home with banner carousel, categories, featured product
- ✅ Product grid (Popular Sweets, Snacks)
- ✅ Category filtered Product List
- ✅ Product Detail with quantity selector & special instructions
- ✅ Cart with live price breakdown & free delivery badge
- ✅ Checkout with Pickup/Delivery toggle & Cash on Delivery
- ✅ Order Success with animated check & step tracker
- ✅ Global cart state via Context API
- ✅ Real-time cart badge on tab bar & header

---

## 🔌 Adding Firebase (Next Steps)

```bash
npm install firebase
```

```js
// constants/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Replace mock data with Firestore queries in each screen.
