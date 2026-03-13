- 🌐 **Live Website:** https://divkart.vercel.app/
- 📊 **Admin Dashboard:** https://divkart-4a9m.vercel.app  ( Use divyanshu.singh.1879@gmail.com as email and 12345678 as password )





🛍️ divkart – AI Powered Ecommerce Store

An advanced full-stack ecommerce platform built with Node.js, React, PostgreSQL, Razorpay, Cloudinary, and Gemini AI for intelligent product search and recommendations.

✔️ Secure Auth (JWT + Cookies)
✔️ AI-powered product search
✔️ Admin Dashboard
✔️ Razorpay Webhooks + Payment Intents
✔️ Fully relational PostgreSQL schema
✔️ Modern, animated UI built with React + Tailwind + Redux Toolkit

🚀 Tech Stack
Frontend

React + Vite

Redux Toolkit

TailwindCSS

ShadCN UI + Lucide Icons

Backend

Node.js / Express

PostgreSQL

JWT Auth

Cloudinary uploader

Nodemailer (Email OTP & Password Reset)

Razorpay Payments

Gemini AI Search (AI product filtering)

📂 Project Structure
backend/
│── app.js
│── server.js
│── config/
│   └── config.env
│── database/
│   └── db.js
│── controllers/
│── middlewares/
│── utils/
│── routes/
│── tables/
└── package.json

frontend/
│── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── features/
│   └── ui/
└── package.json


🏗️ Database (PostgreSQL)
Tables included:

Users

Products

Reviews

Orders

Order Items

Shipping Info

Payments

🔐 Authentication Features
✔ Register
✔ Login
✔ Logout
✔ Get User
✔ Forgot Password
✔ Reset Password
✔ Update Password
✔ Update Profile

JWT stored in secure HTTP-only cookies.

🧠 AI Product Search (Gemini)

The AI modal lets users type prompts like:

“Wireless gaming headphones with good bass under 3000”

Your backend removes stopwords, analyzes keywords, and returns products using semantic matching.

🛒 Ecommerce Features
User

Add to cart

Buy now

Post/edit/delete review

Search products

AI search

View orders

Track status

Admin

Create/update/delete products

Manage all users

Manage all orders

Change order status

Dashboard analytics

💳 Razorpay Payment Workflow

Create Payment Intent

Process card payments

Webhook validates payment

Updates order + payment status in DB

🌄 Cloudinary Integration

Used for:

Product image uploads

Automatic transformations

Secure delivery

📡 Important SQL Queries

Includes advanced JOIN queries:

Fetch single order

Fetch user orders

Fetch all orders

All queries use json_agg and json_build_object to structure nested JSON responses.

🧩 Frontend Highlights
⭐ Sidebar Menu
Home, Products, About, FAQ, Contact, Cart, My Orders

⭐ AI Search Modal

Animated

Pre-filled example prompts

Loader animation

Modern gradient styling

⭐ Product Details Page

Glassmorphism card

Quantity add/remove

Add to cart

Buy now

Wishlist + Share buttons
