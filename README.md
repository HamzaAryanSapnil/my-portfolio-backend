# 💳 My Portfolio Backend

This project is a feature-rich RESTful API developed using **TypeScript**, **Express.js**, and **Prisma + PostgreSQL** designed to simulate for My Portfolio Project Backend System. It includes clear-cut flows for **Admins**. The APIs are built for blog management process only.

---

## 🚀 Features

### 🛡️ Admin
- Login
- View and manage all blogs
---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: Prisma + PostgreSQL
- **Validation**: Zod
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Error Handling**: Centralized, Global Error is handled with a custom AppError Function.
- **Authorization**: Role-based (admin)

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access (`admin`)
- Protected routes with role checks, like no one can access the admin's route except user is an admin. This action is the same for agents' and users' routes.

---

## 📁 Project Structure
```
src
├── app
│ ├── config # Environment configs (e.g., database, secrets)
│ ├── error-helpers # Custom error classes & error formatters
│ ├── helpers # Utility functions (e.g., token generator)
│ ├── interfaces # TypeScript interfaces
│ ├── middlewares # Error handler, auth check, RBAC
│ ├── modules # Domain logic (auth and blog)
│ ├── routes # Centralized route declarations
│ └── utils # Common utilities (e.g., response sender)
├── app.ts # Express app config and middlewares
├── server.ts # App startup and DB connection
.env # Environment variables
.env.example # Sample env for setup
.gitignore
eslint.config.mjs
package.json
tsconfig.json

```
---

## 🧪 API Endpoints (Sample)

Main api: https://my-portfolio-backend-peach.vercel.app/api/v1

### Auth Admin Only
- `POST /auth/login` — Login and receive access token

### Admin
- `GET /blogs` — View all blogs
- `GET /blogs/:slug` — View single Blog
- `POST /blogs/create-blogs` — Add a Blog
- `PATCH /blogs/:id` — Update a blog
- `DELETE /blogs/:id` — Delete a blog
---

## 📦 Setup Instructions

### 1. Clone the Repo

```
bash
git clone https://github.com/HamzaAryanSapnil/my-portfolio-backend.git
cd my-portfolio-backend
```
### 2. Install Dependencies
```
bash
npm install
```

## 3. Configure Environment Variables
### Create a .env file and configure:
```
DATABASE_URL=Your DB

PORT=5000
NODE_ENV=development


JWT_SECRET=Your Secret
JWT_EXPIRES_IN=Your Time
REFRESH_TOKEN_SECRET=Your Refresh Secret
REFRESH_TOKEN_EXPIRES_IN=7d

JWT_REFRESH_EXPIRES_IN=Your Time
RESET_PASS_TOKEN=Your Token
RESET_PASS_TOKEN_EXPIRES_IN=Your Time
RESET_PASS_SECRET=Your Secret
RESET_PASS_LINK=http://Your Url/reset-password

# bcryptjs
SALT_ROUND=10

# Admin credentials
ADMIN_EMAIL=Admin Credentials
ADMIN_PASS=Admin Pass



EMAIL=resend Email
APP_PASS=email pass
```

## 4. Start the Server

### For Development:

```bash
npm run dev
```
### For Production:

```bash
npm run build
npm run start
```


📫 Author
Hamza Aryan Sapnil
📍 Bangladesh
🌐 LinkedIn • 💻 Full Stack Developer

📄 License
This project is licensed for educational purposes under MIT.
