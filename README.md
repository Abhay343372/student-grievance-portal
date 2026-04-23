# 🎓 Student Grievance Management System

A complete MERN stack web application designed to provide a secure and efficient platform for students to report and track their academic and campus-related issues. Built with modern, responsive UI elements and robust API protections.

## ✨ Features
- **User Authentication**: Secure JWT-based login and registration system.
- **Role & Protection**: Protected dashboard route accessible only to authenticated users.
- **Grievance Operations (CRUD)**: Students can submit new grievances, edit their details, or delete them.
- **Categorization**: Sort grievances effortlessly into categories like Academic, Hostel, Transport, and Other.
- **Real-time Status Tracking**: View grievance status clearly via color-coded badges (Pending / Resolved).
- **Live Search**: Instantly filter through your grievance list using the real-time search bar.
- **Modern UI/UX**: Premium styling utilizing Tailwind CSS, responsive cards, glassmorphism, and dynamic toast alerts.

## 🛠️ Technology Stack
- **MongoDB**: NoSQL database for secure data storage.
- **Express.js**: Backend framework for building RESTful APIs.
- **React.js (Vite)**: Lightning-fast frontend library for interactive UI.
- **Node.js**: JavaScript runtime environment for the server.
- **Tailwind CSS v3**: Utility-first CSS framework for custom styling.

## 🚀 Setup Instructions

Follow these instructions to get the project running locally.

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Abhay343372/student-grievance-portal.git
cd student-grievance-portal
\`\`\`

### 2. Backend Setup
Navigate into the backend folder and install the dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

Create a \`.env\` file inside the \`backend\` folder with the following variables:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_grievance
JWT_SECRET=supersecretjwtkey_12345
\`\`\`
*(Note: If you are using MongoDB Atlas, replace the MONGO_URI with your Atlas connection string).*

Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window, navigate into the frontend folder, and install the dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

Start the frontend Vite development server:
\`\`\`bash
npm run dev
\`\`\`

Navigate to \`http://localhost:5173\` in your browser to view the application!

---
*Created by Abhay*
