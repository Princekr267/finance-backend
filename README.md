# Finance Dashboard

A full-stack finance management system with role-based access control.

---

## Monorepo Structure

```
/
├── backend-finance/     # Express + MongoDB REST API
└── frontend-finance/    # React + Vite frontend (API tester / dashboard UI)
```

---

## Quick Start

### 1. Backend

```bash
cd backend-finance
npm install
# create .env (see backend-finance/README.md for required variables)
npm run seed  # Creates the default admin account
npm run dev
```

Runs on: `http://localhost:3000`

### 2. Frontend

```bash
cd frontend-finance
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## Features

- **JWT authentication** — register, login, logout with 7-day token expiry
- **Role-based access control** — viewer / analyst / admin with enforced permissions
- **Financial records** — create, view, update, soft-delete with filtering by type, category, and date
- **Dashboard APIs** — total income/expenses, net balance, category-wise totals, monthly trends
- **User management** — admins can list users, change roles, and activate/deactivate accounts
- **Immediate deactivation** — deactivated users are blocked on every request, not just at login

---

## Documentation

- **[Backend README](./backend-finance/README.md)** — full API reference, setup guide, role permissions table, status code reference

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Validation | Joi + Mongoose validators |
| Frontend | React 19, Vite, Tailwind CSS v4 |
| HTTP client | Axios |