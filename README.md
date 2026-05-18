# 🎓 StudentSphere — Student Management ERP System

A full-stack **MERN** (MongoDB, Express.js, React, Node.js) based Student Management ERP platform with role-based dashboards for **Students**, **Teachers**, and **Admins**. Built with a premium, modern UI inspired by industry-leading educational platforms.

![StudentSphere Banner](https://img.shields.io/badge/StudentSphere-ERP%20System-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiIGZpbGw9IndoaXRlIi8+PC9zdmc+)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based secure authentication with role-based access control
- Protected routes for Admin, Teacher, and Student portals
- Encrypted passwords using bcrypt
- Role selection landing page before login/signup

### 👨‍💼 Admin Dashboard
- **Dashboard Overview** — Total students, teachers, departments at a glance
- **Student Management** — Add, view, and manage all enrolled students
- **Teacher Management** — Add and manage faculty members
- **Department Management** — View department-wise student and faculty count
- **Attendance Logs** — School-wide real-time attendance tracking with filters

### 👨‍🏫 Teacher Dashboard
- **Class Overview** — View assigned students based on department
- **Mark Attendance** — Mark present/absent for students with real-time notifications
- **Upload Results** — Add marks, auto-grade calculation (A+, A, B, C, D, F)
- **Create Assignments** — Post assignments with deadlines for specific classes
- **Student Comparison** — Compare two students' academic performance side by side
- **Leave Management** — Approve or reject student leave applications

### 👨‍🎓 Student Dashboard
- **Personal Dashboard** — Attendance rate, global rank, academic results
- **Results Table** — View subject-wise marks, grades, and pass/fail status
- **Attendance Trend** — Visual graph showing attendance over time
- **Apply for Leave** — Submit leave applications with date range and reason
- **Profile Management** — Update personal details and profile information
- **Smart Suggestions** — AI-powered recommendations based on performance

### 🎨 Premium UI/UX
- **Light Theme** with warm gradient backgrounds (ChaiCode-inspired aesthetic)
- **Glassmorphism** effects on sidebar and header (backdrop-blur)
- **Hover Lift Animations** — Cards float up with glowing orange shadows on hover
- **Role-based Color Coding** — Orange (Student), Green (Teacher), Purple (Admin)
- **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile
- **Custom Scrollbars** — Orange/peach themed scrollbar design

### 🔔 Real-time Notifications
- Socket.io integration for instant notifications
- Attendance alerts for absent students
- Result upload notifications
- Leave approval/rejection notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Redux Toolkit, Recharts, Lucide Icons |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Real-time** | Socket.io |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
StudentSphere/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components (Sidebar, AdminLayout, ProtectedRoute)
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Role selection landing page
│   │   │   ├── Login.jsx      # Login with role-specific UI
│   │   │   ├── Signup.jsx     # Registration with role pre-selection
│   │   │   ├── Dashboards.jsx # Admin, Teacher & Student dashboards
│   │   │   ├── admin/         # Admin sub-pages (Students, Teachers, Departments, Attendance)
│   │   │   ├── teacher/       # Teacher sub-pages (Attendance, Results, Assignments, Leaves)
│   │   │   └── student/       # Student sub-pages (Leave application)
│   │   ├── redux/             # Redux store & slices (authSlice)
│   │   ├── services/          # Axios API configuration
│   │   └── App.jsx            # Main app with routing
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── controllers/           # Business logic (auth, admin, teacher, student)
│   ├── middleware/             # JWT auth middleware & role authorization
│   ├── models/                # Mongoose schemas (User, Student, Teacher, Attendance, Result, etc.)
│   ├── routes/                # Express route handlers
│   ├── utils/                 # Notification helper utilities
│   ├── server.js              # Entry point with Socket.io setup
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB Atlas** account (or local MongoDB)
- **Git** installed

### 1. Clone the Repository
```bash
git clone https://github.com/rakshitsharma821/StudentSphehreproject.git
cd StudentSphehreproject
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login & get JWT token | Public |
| GET | `/profile` | Get user profile | Private |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/students` | Get all students | Admin |
| POST | `/students` | Add new student | Admin |
| GET | `/teachers` | Get all teachers | Admin |
| POST | `/teachers` | Add new teacher | Admin |
| GET | `/departments` | Get department stats | Admin |
| GET | `/attendance` | Get all attendance logs | Admin |
| GET | `/stats` | Get dashboard statistics | Admin |

### Teacher Routes (`/api/teacher`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/students` | Get assigned students | Teacher |
| POST | `/attendance` | Mark student attendance | Teacher |
| POST | `/results` | Upload student results | Teacher |
| POST | `/assignments` | Create new assignment | Teacher |
| POST | `/compare` | Compare two students | Teacher |
| GET | `/leaves` | View leave applications | Teacher |
| PUT | `/leaves/:id` | Approve/Reject leave | Teacher |

### Student Routes (`/api/student`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Get student dashboard data | Student |
| POST | `/leave` | Apply for leave | Student |
| PUT | `/profile` | Update student profile | Student |

---

## 🧪 Testing with Postman

1. **Register** a user via `POST /api/auth/register`
2. **Login** via `POST /api/auth/login` → Copy the JWT token
3. Use the token in **Authorization → Bearer Token** for all protected routes
4. Test each role's APIs using the corresponding user's token

> ⚠️ **Important:** Admin token works only on `/api/admin/*`, Teacher token on `/api/teacher/*`, and Student token on `/api/student/*`

---

## 📸 Screenshots

| Landing Page | Admin Dashboard | Student Dashboard |
|:---:|:---:|:---:|
| Role Selection | Stats & Charts | Results & Attendance |

---

## 👨‍💻 Developer

**Rakshit Sharma**

- GitHub: [@rakshitsharma821](https://github.com/rakshitsharma821)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
#   S t u d e n t S p h e r e  
 