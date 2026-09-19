# 🔎 LostLink — AI-Powered Lost & Found Platform

LostLink is a full-stack web application designed to help users report, search, and recover lost and found items.

The platform allows users to create lost/found reports, upload item images, search available reports, and discover possible matches between lost and found items.

---

## 🚀 Features

* 👤 User Registration and Login
* 🔐 JWT-based Authentication
* 📋 Report Lost Items
* 📦 Report Found Items
* 📸 Image Upload
* 🔍 Search and Filter Items
* 📄 Item Details
* ✏️ Edit Report
* 🗑️ Delete Report
* 🤖 Automated Lost & Found Matching
* 🔔 Match Notifications
* 👤 User Profile
* 📱 Responsive User Interface

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman

---

## 📁 Project Structure

```text
LostLink/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LostItem.jsx
│   │   │   ├── FoundItem.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── EditItem.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── uploads/
│   └── package.json
│
└── README.md
```

---

## 🏗️ Project Architecture

LostLink follows a full-stack client-server architecture.

### Frontend

The React frontend provides:

* User interface
* Authentication pages
* Dashboard
* Lost and Found forms
* Item details
* Profile management
* Notifications
* API communication using Axios

### Backend

The Node.js and Express backend provides:

* REST APIs
* User authentication
* Item management
* Image upload handling
* Matching logic
* Notification management

### Database

MongoDB stores:

* User information
* Lost and found item reports
* Notifications

The frontend communicates with the backend through REST APIs, while the backend communicates with MongoDB for data storage and retrieval.

---

## 🤖 Matching System

LostLink automatically compares lost and found reports to identify possible matches.

The matching system compares important item details such as:

* **Category**
* **Color**
* **Location**
* **Title**
* **Description**

Each matching property contributes to a match score.

### Match Score

| Property            |    Score |
| ------------------- | -------: |
| Same Category       |       30 |
| Same Color          |       20 |
| Same Location       |       25 |
| Similar Title       |       15 |
| Similar Description | Up to 10 |

Items that reach the configured matching threshold are displayed as **Possible Matches**.

The system also displays reasons for the match, such as:

* Same category
* Same color
* Same location
* Similar title
* Similar description

---

## 🔔 Notification System

LostLink includes a notification system that keeps users informed about possible item matches.

### Notification Features

* 🔔 Notification bell in the Navbar
* 🔴 Unread notification count
* 📋 Notifications page
* 🆕 New notification indicator
* ✅ Mark individual notification as read
* ✅ Mark all notifications as read
* 🔗 Open the related item directly
* 🕒 Notification creation time

When a possible match is detected, the system creates a notification containing the match information and related item.

---

## ⚙️ Installation & Setup

### 1. Clone the Project

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd LostLink
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 4. Open the Application

Open the frontend URL in your browser and register a new account to start using LostLink.

---

## ▶️ How to Use

1. Register a new account.
2. Login to LostLink.
3. Open the Dashboard.
4. Create a **Lost Item** or **Found Item** report.
5. Add item details such as title, category, color, location, and date.
6. Upload an item image.
7. View the submitted report from the Dashboard.
8. Open the item details page to check possible matches.
9. Check notifications for possible matches.
10. Use the Profile page to manage your reported items.
11. Edit or delete reports when required.
12. Logout when finished.

---

## 🔮 Future Scope

LostLink can be further improved with the following features:

* 🧠 Advanced AI-based image similarity
* 📍 Location-based matching using maps
* 📧 Email notifications
* 📱 SMS notifications
* ⚡ Real-time notifications using WebSockets
* ☁️ Cloud-based image storage
* 🛡️ Admin dashboard
* 🔍 Advanced search and filtering
* 📱 Dedicated mobile application
* 🤖 Improved natural-language similarity
* 🔐 Additional security and fraud-prevention features

---

## 🎯 Project Objective

The main objective of LostLink is to provide a centralized digital platform for reporting and finding lost items.

The application helps users:

* Report lost items
* Report found items
* Search available reports
* Compare possible matches
* Receive notifications
* Manage their reports

LostLink combines a modern React frontend, Node.js backend, MongoDB database, image upload functionality, automated matching, and notification services into one platform.

---

## 📌 Project Status

**Status: Completed ✅**

### Currently Implemented

* ✅ User Registration
* ✅ User Login
* ✅ JWT Authentication
* ✅ Lost Item Reporting
* ✅ Found Item Reporting
* ✅ Image Upload
* ✅ Dashboard
* ✅ Search & Filters
* ✅ Item Details
* ✅ Edit Item
* ✅ Delete Item
* ✅ User Profile
* ✅ Automated Matching
* ✅ Notifications
* ✅ Responsive Navbar

---

## 👨‍💻 Project

**LostLink — AI-Powered Lost & Found Platform**

A full-stack web application developed using modern web technologies to make the process of reporting and recovering lost and found items easier and more organized.
