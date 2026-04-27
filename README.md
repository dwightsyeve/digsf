# PrimeInvest - Elite Wealth Management Platform

PrimeInvest is a production-grade investment management application designed for elite investors. It provides a seamless interface for managing digital assets, tracking portfolio performance, and executing secure financial transactions.

## 🚀 Features

### For Investors
- **Comprehensive Dashboard**: Real-time tracking of portfolio growth, wallet balance (₦), and transaction history.
- **Secure Transactions**: Streamlined deposit and withdrawal workflows with receipt upload verification.
- **Investment Management**: Access to diversified investment portfolios with performance analytics.
- **Live Support Chat**: 24/7 direct access to support agents and automated AI assistance.
- **Modern Responsive Design**: Optimized for both desktop and mobile devices using a "Swiss-Modern" aesthetic.

### For Administrators
- **User Management**: Complete control over user profiles, wallet balances, roles, and account statuses.
- **Transaction Processing**: Real-time queue for approving or declining financial requests with integrated receipt viewing.
- **Live Chat Center**: Centralized hub for responding to user support messages in real-time.
- **Inquiry Management**: Systematic handling of contact form submissions and service inquiries.
- **System Configuration**: Global controls for platform-wide settings.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Backend/Database**: Firebase (Firestore, Authentication, Storage)
- **Icons**: Lucide React
- **AI**: Google Gemini Pro (Support Chat integration)

## 📦 Project Structure

- `src/components`: Reusable UI components (Modals, ChatBot, Layouts).
- `src/context`: Auth and Application state management.
- `src/pages`: Main application views (Dashboard, Admin, Home, Contact, etc.).
- `src/lib`: Logic for Firebase initialization and utility functions.
- `src/services`: External API services including AI integration.

## ⚙️ Setup & Configuration

### Environment Variables
Configure the following in your environment or `.env` file:
- `VITE_ADMIN_EMAIL`: The bootstrap administrator email.
- `GEMINI_API_KEY`: API key for support chat assistance.

### Firebase Configuration
The application requires a Firebase project with:
- **Firestore**: Enabled in production mode.
- **Authentication**: Google Sign-In and Email/Password enabled.
- **Security Rules**: Deploy the provided `firestore.rules` to secure the database.

## 🔐 Security

- **Strict Firestore Rules**: Attribute-based access control (ABAC) ensuring users only access their own data while admins maintain oversight.
- **Identity Integrity**: Server-side validation for all financial state changes.
- **PII Isolation**: Secure handling of sensitive user information.

---

© 2026 PrimeInvest. Built for precision. Secure by design.
