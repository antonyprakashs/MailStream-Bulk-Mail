# 📧 MERN Bulk Mail Application

A Full-Stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to send bulk emails efficiently. This project demonstrates end-to-end full-stack development, including API integration, database management, and email transmission via Node.js.

---

## 🚀 Objective
To provide a user-friendly interface for sending bulk emails while maintaining a robust backend to handle mail delivery and a database to log email history and statuses.

---

## ✨ Features

### Frontend (React)
* **Interactive Dashboard:** Clean, user-friendly interface for composing emails.
* **Input Forms:** Fields for Email Subject, Body, and Recipient List (comma-separated or file upload).
* **Real-time Feedback:** Form validation and dynamic success/failure toast notifications.
* *(Optional)* **Email History View:** A dedicated page to view previously sent emails and their delivery statuses.
* *(Optional)* **Admin Authentication:** Secure login page to restrict access to the mailer dashboard.

### Backend (Node.js + Express)
* **RESTful API:** Endpoints to receive and process mail data from the React frontend.
* **Mail Integration:** Utilizes `nodemailer` to securely handle and route bulk email dispatches.
* **Error Handling & Logging:** Comprehensive error handling for failed deliveries, invalid emails, and server issues.

### Database (MongoDB)
* **Data Persistence:** Stores comprehensive email records, including:
  * Subject
  * Body text/HTML
  * Recipient lists
  * Delivery status (Success/Failed)
  * Timestamps

---

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS/Tailwind (or your preferred styling library)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Utilities:** Nodemailer (for SMTP email sending), Cors, Dotenv

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* An SMTP service account (e.g., Gmail, SendGrid, or Mailgun) for sending emails.

---

## 💻 Installation & Setup

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/bulk-mail-app.git](https://github.com/yourusername/bulk-mail-app.git)
cd bulk-mail-app
