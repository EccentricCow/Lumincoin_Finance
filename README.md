# Expense & Income Tracker

**Expense & Income Tracker** is a web application for managing personal finances.  
The frontend is implemented in **TypeScript** (with Bootstrap for UI).  
The backend is built with **Node.js + Express** and provides RESTful APIs for authentication, categories, operations, and balance management.

---

## Features

- User registration, login, and logout
- Sidebar with user’s full name (from registration) and current balance
- Income and Expense categories:
  - Add, edit, and delete categories
- Income and Expense operations:
  - View all operations in tables
  - Add, edit, and delete operations
- Real-time balance updates in the sidebar
- Dashboard with **Chart.js** visualizations:
  - Separate charts for income and expenses
- Date filtering for operations (on dashboard and operations page)

---

## Technologies

- **Frontend:**  
  - Vanilla JavaScript version  
  - TypeScript version  
  - Bootstrap for styling  
  - Chart.js for data visualization  

- **Backend:**  
  - Node.js + Express  
  - REST API for authentication, categories, operations, and balance  

- **Package Manager:** npm

---

## Installation

### Backend

1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Start the backend server:
```bash
npm start
```

### Frontend

1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Open index.html in your browser (or run via a local server).

---

### Usage

1. Start the backend server.
2. Open the frontend.
3. Register a new user or log in with existing credentials.
4. Add categories, operations, and explore the dashboard.
