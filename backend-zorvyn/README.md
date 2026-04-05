# Finance Backend — Zorvyn

A RESTful API for financial records management with role-based access control, built with **Node.js**, **Express**, and **MongoDB**.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi + Mongoose validators |
| Password hashing | bcrypt |

---

## Project Structure

```
backend-zorvyn/
├── controllers/
│   ├── auth.controller.js        # register, login, logout
│   ├── records.controller.js     # CRUD + filtering for financial records
│   ├── dashboard.controller.js   # summary, by-category, monthly trends
│   └── users.controller.js       # list users, update role, update status
├── middlewares/
│   ├── auth.middleware.js        # JWT verification + isActive check + Joi validators
│   └── role.middleware.js        # Role-based access guard
├── models/
│   ├── user.model.js             # User schema (name, email, password, role, isActive)
│   └── financialRecords.model.js # Record schema (amount, type, category, date, etc.)
├── routes/
│   ├── auth.router.js
│   ├── records.router.js
│   ├── dashboard.router.js
│   └── users.router.js
├── schema.js                     # Joi schema for registration input
└── index.js                      # App entry point, DB connection, middleware config
```

---

## Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### Install & run

```bash
cd backend-zorvyn
npm install
npm run dev
```

### Environment variables (`.env`)

```env
PORT=3000
MongoDB=mongodb://127.0.0.1:27017/finance
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

---

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login and receive JWT |
| POST | `/logout` | ❌ | Clear auth cookie |

**Register body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "viewer"
}
```
Roles: `viewer` | `analyst` | `admin`

**Login body:**
```json
{ "email": "alice@example.com", "password": "secret123" }
```

**Login response:**
```json
{ "token": "<jwt>" }
```

---

### Financial Records — `/api/records`

| Method | Endpoint | Roles allowed | Description |
|---|---|---|---|
| GET | `/` | All | List records (supports filters) |
| POST | `/` | admin, analyst | Create a record |
| PATCH | `/:id` | admin | Update a record |
| DELETE | `/:id` | admin | Soft-delete a record |

**GET query params (all optional):**

| Param | Example | Description |
|---|---|---|
| `type` | `income` or `expense` | Filter by type |
| `category` | `food` | Filter by category |
| `date` | `2024-03` | Filter by year-month |

**Record body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-03-01",
  "description": "March salary"
}
```

Categories: `food` | `health` | `education` | `transport` | `rent` | `salary` | `entertainment` | `other`

> Records are **soft-deleted** — they are marked `is_deleted: true` and excluded from all queries, not removed from the DB.

---

### Dashboard — `/api/dashboard`

| Method | Endpoint | Roles allowed | Description |
|---|---|---|---|
| GET | `/summary` | All | Total income, expenses, net balance |
| GET | `/by-category` | All | Totals grouped by category |
| GET | `/trends` | All | Monthly totals grouped by type |

**Summary response:**
```json
{ "totalIncome": 15000, "totalExpenses": 8000, "netBalance": 7000 }
```

---

### Users — `/api/users`

| Method | Endpoint | Roles allowed | Description |
|---|---|---|---|
| GET | `/` | admin | List all users (passwords excluded) |
| PATCH | `/:id/role` | admin | Change a user's role |
| PATCH | `/:id/status` | admin | Activate / deactivate a user |

**Update role body:**
```json
{ "role": "analyst" }
```

**Update status body:**
```json
{ "isActive": false }
```

---

## Roles & Permissions

| Action | viewer | analyst | admin |
|---|---|---|---|
| View records | ✅ | ✅ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Create record | ❌ | ✅ | ✅ |
| Update record | ❌ | ❌ | ✅ |
| Delete record | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Change user role | ❌ | ❌ | ✅ |
| Activate / deactivate user | ❌ | ❌ | ✅ |

---

## Active / Inactive User Logic

- All users are **active by default** (`isActive: true`)
- An **admin** can deactivate any user via `PATCH /api/users/:id/status` with `{ "isActive": false }`
- **Inactive users cannot log in** — login returns `403 Forbidden`
- **Inactive users with existing tokens are blocked immediately** — `authMiddleware` checks `isActive` from the DB on every request, so deactivation takes effect without waiting for the token to expire

---

## HTTP Status Codes Used

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET / PATCH |
| 201 | Created | Successful POST (register, create record) |
| 400 | Bad Request | Missing fields, invalid enum values, bad ID format |
| 401 | Unauthorized | Missing or invalid token, wrong credentials |
| 403 | Forbidden | Inactive account, insufficient role |
| 404 | Not Found | Record or user ID does not exist |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Unexpected DB or runtime errors |

---

## Validation

- **Registration** — Joi schema validates name, email format, password length (min 6), and role enum before the request reaches the controller
- **Login** — email and password presence checked before controller
- **Records** — required fields checked in controller; Mongoose schema enforces `min`, `enum`, and `maxlength` constraints; `runValidators: true` is set on updates
- **Role update** — validated against `["viewer", "analyst", "admin"]` with clear error message
- **Status update** — `isActive` validated as a strict `boolean`

---

## Optional Features Implemented

- ✅ JWT authentication with 7-day expiry
- ✅ Soft delete for records
- ✅ Filtering records by type, category, and date
- ✅ Immediate deactivation enforcement (DB check on every request)
- ✅ `httpOnly` cookie alongside JWT token response
