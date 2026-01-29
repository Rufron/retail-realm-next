# 🛍️ Modern Product Dashboard

![Project Screenshot](./image.png)

A responsive, Amazon-style product dashboard built with:

- ✅ Next.js 13+ (App Router)
- 🎨 Tailwind CSS + ShadCN for UI
- ⚡ TypeScript
- 🔁 React Query for data fetching
- 🌘 Dark mode toggle
- 🧠 Clean, component-based architecture
- Daraja API & Stripe

---

## 🚀 Features
- Payments: Stripe for cards, Safaricom Daraja API for M-Pesa
- Product grid with title, rating, image, and price
- Responsive layout (mobile to desktop)
- Search & category filters
- Product detail pages
- Loading & error states
- Dark mode toggle
- Lazy-loaded images
- Clean folder structure & reusable components

---

## 🔧 Tech Stack

- `Next.js 13+` (App Router)
- `Tailwind CSS`
- `TypeScript`
- `React Query`
- `ShadCN UI components`
- `PostgreSQl`
---

## 📦 Setup Instructions

### 1. Clone the repo

git clone https://github.com/Rufron/retail-realm-next.git

cd retail-realm-next

### 2. Install dependencies
bash

npm install

### 3. Environment Setup

    Create .env file:

    ### - Database
    DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

    ### - Authentication
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"

    ### - Stripe Payments
    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_WEBHOOK_SECRET="whsec_..."
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

    ### - M-Pesa Payments (Sandbox)
    MPESA_CONSUMER_KEY="sandbox_..."
    MPESA_CONSUMER_SECRET="sandbox_..."
    MPESA_SHORTCODE="174379"
    MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd..."
    MPESA_CALLBACK_URL="http://localhost:3000/api/mpesa/callback" //USE NGROK assume : https://abc123.ngrok.app

### 3. Run the development server

npm run dev

Go to http://localhost:3000 in your browser.





