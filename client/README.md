# 🚗 Car Rental Web Application

A full-stack car rental platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Customers can browse and book vehicles, while car owners manage listings and track bookings from a dedicated dashboard.

> 📺 Built following this tutorial: [Build a Car Rental App with MERN Stack – GreatStack](https://www.youtube.com/watch?v=tBObk72EYYw)

---

## ✨ Features

### Customer
- Register / Login with JWT authentication
- Browse and filter cars by location, category, fuel type
- View car details with specs and description
- Book a car with pickup & return dates (auto price calculation)
- View and cancel bookings
- Update profile and reset password

### Owner
- Dedicated owner dashboard with stats (total cars, bookings, revenue)
- Add car listings with image upload
- Manage car availability (edit, delete, toggle)
- View all customer bookings and confirm / cancel them

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Build Tool | Vite 8 |

---

## 📁 Project Structure

```
CIE2-carental/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Login, CarCard
│   │   ├── pages/          # Home, Cars, CarDetail, MyBookings, Profile
│   │   │   └── owner/      # Dashboard, AddCar, ManageCars, ManageBookings
│   │   ├── context/        # AppContext (global state)
│   │   └── assets/         # Images, icons, static data
│   └── vite.config.js
│
└── server/                 # Express backend
    ├── models/             # User, Car, Booking schemas
    ├── routes/             # authRoutes, carRoutes, bookingRoutes, ownerRoutes
    ├── middleware/         # JWT protect, ownerOnly
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Emera1d-R0SE/CIE2-CarRental.git
cd CIE2-carental
```

### 2. Setup the server
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the client:
```bash
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🔑 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/cars` | List all cars (with filters) |
| GET | `/api/cars/:id` | Get single car |
| POST | `/api/cars` | Add car (owner only) |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get user's bookings |
| GET | `/api/owner/dashboard` | Owner stats |
| GET | `/api/owner/bookings` | Owner's bookings |

---

---

## 📄 License

This project is for educational purposes as part of a college CIE submission.
