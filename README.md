# 🔗 LinkShortener Backend API

A secure, full-featured URL shortener backend built with **Node.js**, **Express**, **MySQL**, and **JWT** authentication.

---

## 🚀 Features

- ✅ User registration & login with JWT
- ✂️ URL shortening
- 📊 Track clicks
- 🧾 Export links to CSV
- 📁 Pagination
- 🛡 Admin dashboard APIs

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: MySQL
- **Auth**: JWT
- **CSV Export**: `fast-csv`
- **Short Code**: `nanoid`

---

## 📦 Setup Instructions

### 1. Clone the project

```bash
- git clone https://github.com/yourusername/LinkShortener-backend.git
- cd LinkShortener-backend

**### 2. Install dependencies**

- npm install

**### 3. Create .env file**

- PORT=5000
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=yourpassword
- DB_NAME=linkshortener
- JWT_SECRET=your_jwt_secret

**### 4. MySQL Schema**

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  type TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE urls (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INT DEFAULT 0,
  expires_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

### ✂️ Shortener (User)
| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/shorten`         | Shorten a long URL   |
| GET    | `/u/:code`         | Redirect to original |
| GET    | `/my-links`        | Paginated links      |
| GET    | `/my-links/export` | CSV export of links  |

###🛡 Admin

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| GET    | `/api/admin/users`            | List all users             |
| GET    | `/api/admin/users/:id/links`  | Paginated links of a user  |
| GET    | `/api/admin/users/:id/export` | CSV export of user’s links |

⚠️ All routes require Authorization: Bearer <JWT> header.

**### ⚙️ Scripts**

npm run dev   # Run in dev mode with nodemon
npm start     # Run in production

**### 🧰 Dev Tools**

nanoid for short code generation
fast-csv for exporting CSVs
dotenv for environment configs

**### 🛡 User Roles
**
| Role  | Type | Description     |
| ----- | ---- | --------------- |
| Admin | 2    | Full access     |
| User  | 1    | Access own data |

**### 🧾 Sample JWT Payload**

{
  "id": 1,
  "email": "admin@site.com",
  "type": 2
}

**## ✍️ Author**

Developed by Piyush
📧 Contact: piyushh.dev@gmail.com

**## 📃 License**

MIT License
