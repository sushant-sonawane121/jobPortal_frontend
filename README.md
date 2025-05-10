# Job Portal - Full Stack Application

This is a full-stack Job Portal application. It consists of a backend server built with Express, MongoDB, and JWT Authentication. The frontend is built with React, Vite, and Tailwind CSS.

## Project Setup

### Prerequisites

Before you start, ensure that you have the following installed on your machine:

- **Node.js** (v16 or higher)
- **MongoDB** (or use a MongoDB cloud instance like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**

---

## Backend Setup

### 1. Clone the Repository

Clone the repository by running:

```bash
git clone [REPOSITORY_URL]
cd backend

Install dependencies:
npm install
Create a .env file in the root of the backend project and add the following environment variables:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Replace your_mongodb_connection_string with your MongoDB connection string (e.g., from MongoDB Atlas).

Replace your_jwt_secret_key with a secret key for signing JWT tokens.

Run the backend server:
npm start
The backend will be running at http://localhost:3000.

Frontend Setup
Navigate to the frontend directory:
cd frontend
Install dependencies:
npm install
Run the frontend application:
npm run dev
The frontend will be running at http://localhost:3000.

Development
To develop the frontend with live-reloading, you can run:
npm run dev
This will start the Vite development server with hot module replacement.
