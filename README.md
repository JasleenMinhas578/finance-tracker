# 💸 Finance Tracker WebApp

A modern, full-stack personal finance management application that helps users track expenses, manage budgets, and visualize spending patterns. Built with **React.js** for the frontend and **Firebase** (Authentication + Firestore) for the backend, it delivers a secure and seamless experience across devices.

---

## ✨ Features

### 🔐 User Authentication
- Secure Login/Signup with **Email & Password**
- Protected routes using Firebase Auth
- Session management using React Context API

### 💵 Expense Management
- Add detailed expenses (title, amount, category, date)
- View expenses in card or table view with sorting & filtering
- Delete outdated or incorrect entries

### 🗂️ Custom Category System
- Create custom spending categories
- Visual breakdown of expenses using pie/bar charts

### 📈 Reports & Analytics
- Filter by date range or category
- Interactive charts powered by **Chart.js**
- Export reports to PDF using **jsPDF** & **html2canvas**

### 📱 Responsive Design
- Fully responsive for **desktop, tablet, and mobile**

---

## 🏗️ Technical Architecture

### Frontend – React.js

#### Components
- **Auth**: Login & Signup with form validation
- **Dashboard**: Main interface with financial summary
- **Expenses**: Add, view, delete expenses
- **Categories**: Manage spending categories
- **Reports**: Visualize and export analytics

#### Tech Highlights
- **React Context API** for global state (authentication, expenses)
- **Flexbox/Grid layout** for responsive UI
- **react-icons** for intuitive visuals

### Backend – Firebase

- **Authentication**: Email/Password login via Firebase Auth
- **Database**: Firestore NoSQL for expenses, categories, users
- **Security Rules**: Granular access control (user-specific data)

---

## 🔗 Third-Party Libraries

- 📊 [Chart.js](https://www.chartjs.org/) – Visual analytics
- 🖨️ [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://github.com/niklasvh/html2canvas) – PDF export
- 📆 [date-fns](https://date-fns.org/) – Date formatting

---

## 🚀 Getting Started

### 🔧 Requirements

- [Node.js](https://nodejs.org/) v16+
- npm or yarn
- A Firebase project

### 🛠️ Installation

1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd Finance-Tracker
```

2. **Install Dependencies**

```bash
npm install
```

3. **Firebase Setup**

- Create a Firebase project
- Enable Authentication (Email/Password) and Firestore
- Copy your config and add it to src/firebase.js

```bash
// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_BUCKET',
  messagingSenderId: 'YOUR_MSG_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

```

4. **Start the App**

```bash
npm start
```

Visit http://localhost:3000 to view the app.