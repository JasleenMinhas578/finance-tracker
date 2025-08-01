
# 💸 Finance Tracker WebApp

A full-stack, responsive personal finance management system designed to help users track their expenses, categorize transactions, generate financial reports, and visualize spending patterns. Developed using **React.js** and **Firebase**, this project demonstrates software design and specification principles along with verification and validation techniques.

This repository contains all assets, source code, and documentation supporting the development, testing, and reporting of the Finance Tracker WebApp.

---

## ✨ Features

### 🔐 User Authentication
- Secure email/password login with Firebase Auth
- Session-based route protection using React Context API

### 💵 Expense Management
- Add, edit, delete expenses with title, amount, category, and date
- View and sort expenses in table or card format

### 🗂️ Category Customization
- User-defined categories such as Food, Travel, Groceries, etc.
- Flexible filtering of expenses by category

### 📈 Visual Analytics & Reporting
- Dynamic charts (Pie, Bar, Line) using **Chart.js**
- Filter by date or category
- Export financial summaries and graphs to **PDF** (via jsPDF & html2canvas)

### 🧑‍💻 Admin-Friendly Design
- Modular components for scalability and reusability
- Secure Firebase Firestore access control with rule-based logic

### 📱 Responsive Design
- Optimized layout using Flexbox, CSS Grid, and media queries
- Seamless experience on desktop, tablet, and mobile

---

## 🏗️ Technical Architecture

### Frontend – React.js

#### Component Layers
- **Auth**: Login, Signup, Route Guards (PrivateRoute.jsx)
- **Dashboard**: Main view summarizing activity and spending
- **Expense Module**: Add, view, and manage transactions
- **Categories**: Create and assign user-defined categories
- **Reports**: Charts and exportable summaries

#### Highlights
- React Context API for global state (auth, expense, category)
- CSS Modules and responsive utility-first styling
- Chart.js integration for analytics

### Backend – Firebase

- **Authentication**: Email/password-based auth flow
- **Firestore**: NoSQL real-time database
- **Security Rules**: Enforces user-specific access on document level

---

## 📦 Libraries & Tools Used

| Category              | Tool / Library            |
|-----------------------|---------------------------|
| Frontend Framework    | React.js                  |
| State Management      | Context API               |
| Authentication        | Firebase Auth             |
| Database              | Firestore (Firebase)      |
| Charting Library      | Chart.js                  |
| PDF Export            | jsPDF, html2canvas        |
| Date Utility          | date-fns                  |
| Testing Tools         | Jest, React Testing Library |

---

## 🚀 Getting Started

### 🔧 Requirements

- [Node.js](https://nodejs.org/) v16+
- npm or yarn
- Firebase Project (with Authentication & Firestore enabled)

### 🛠️ Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/finance-tracker-webapp.git
cd finance-tracker-webapp
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Firebase**
- Create a Firebase project
- Enable Authentication (Email/Password)
- Enable Firestore
- Add the config to `/src/firebase.js`:

```js
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

4. **Run the App**
```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---



## ✅ Working Project

<p align="center">
  <img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/65772366-5e5b-4ace-a166-76cbdc774ae3" />
  <br/>
  <em>Figure 1: Landing Page</em>
</p>

<p align="center">
  <img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/6f22e184-00a4-420e-a101-2a011b108af2" />
  <br/>
  <em>Figure 2: Dashboard showcasing user expenses and analytics</em>
</p>


<p align="center">
  <img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/474d0924-cc1f-4706-8dcd-fce33b11daf1" />
  <br/>
  <em>Figure 3: Page to add expenses and list them</em>
</p>

<p align="center">
  <img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/01cbf9c5-6302-4631-ad61-f9ea3f0df316" />
  <br/>
  <em>Figure 4: Adding the Expenses form</em>
</p>


<p align="center">
  <img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/054d8a39-328d-47c5-8c85-f09ef1c8c911" />
  <br/>
  <em>Figure 5: Categories listing page</em>
</p>

<p align="center">
<img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/eb3cbc08-904a-4ee5-af1f-af59573d3bf8" />
  <br/>
  <em>Figure 6: Report showcasing user expenses and analytics</em>
</p>


<p align="center">
<img width="1438" height="658" alt="image" src="https://github.com/user-attachments/assets/6c4280bb-6b8a-4ef9-a34b-792f8df382b6" />
  <br/>
  <em>Figure 7: Report showcasing user expenses and analytics</em>
</p>













## ✅ Project Status

- All major components are implemented and fully tested
- No critical bugs found during V&V process
- Verified using unit, system, and exploratory testing

**Future Enhancements:**
- Budget goal planning and monthly savings tracker
- Import/export transactions via CSV
- Notifications or reminders for overspending

---

## 📄 License

This is an academic project developed for coursework. Not intended for commercial use.

---
