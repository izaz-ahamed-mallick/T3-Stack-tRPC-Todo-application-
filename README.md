# 📌 To-Do Application with Admin Panel

## 🚀 Overview
This is a modern and feature-rich **To-Do Web Application** with an integrated **Admin Panel** for managing users, tasks, and activity logs. Built with the latest web technologies, it provides a seamless experience for task management while ensuring administrators have full control.

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend:** tRPC
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **UI Library:** Tailwind CSS (Black Theme, Dark/Light Mode Support)
- **Hosting:** Vercel / AWS

## ✨ Features
### 📝 User Features
- ✅ Task Creation, Editing, and Deletion
- ✅ Task Categorization with Labels & Deadlines
- ✅ Drag-and-Drop Task Prioritization
- ✅ Mark Tasks as Completed
- ✅ Responsive UI with Dark Mode Support

### 🔐 Admin Features
- ✅ User Management (View, Edit Roles, Delete Accounts)
- ✅ Task Management (View, Edit, Delete Tasks)
- ✅ Activity Logs (Track User Actions)
- ✅ Dashboard Overview (Users, Active/Completed Tasks, Logs)

## 📦 Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/izaz-ahamed-mallick/T3-Stack-tRPC-Todo-application-.git
cd T3-Stack-tRPC-Todo-application
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env.local` file and configure the following variables:
```env
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts
- **`npm dev`** - Start the development server
- **`npm build`** - Build the production version
- **`npm start`** - Start the production server
- **`npm lint`** - Run the linter

## 🚀 Deployment
This application is optimized for deployment on **Vercel** or **AWS**. Follow the respective platform’s deployment guide.

## 🛠 Contributing
Feel free to contribute! Fork the repo, make changes, and submit a pull request.

## 📜 License
This project is open-source and available under the **MIT License**.



