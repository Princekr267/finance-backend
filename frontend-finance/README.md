# Finance Frontend

A React-based frontend application for testing and interacting with the Finance Management API. Built with **React 19**, **Vite**, and **Tailwind CSS v4**.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| State Management | React Hooks (useState) |

---

## Project Structure

```
frontend-finance/
├── src/
│   ├── App.jsx           # Main app component
│   ├── Test.jsx          # API testing interface component
│   ├── main.jsx          # App entry point
│   ├── index.css         # Global styles + Tailwind imports
│   └── assets/           # Static assets
├── public/               # Public static files
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── eslint.config.js      # ESLint configuration
```

---

## Setup

### Prerequisites
- Node.js v18+
- Backend API running on `http://localhost:3000`

### Install & Run

```bash
cd frontend-finance
npm install
npm run dev
```

The app will run on: `http://localhost:5173`

---

## Features

### Authentication
- **Register** — Create new user accounts with name, email, password, and role
- **Login** — Authenticate users and receive JWT tokens
- **Logout** — Clear authentication tokens and session data
- **Auto-attach token** — Axios interceptor automatically adds JWT to all API requests

### Dashboard
- **Summary View** — Display total income, total expenses, and net balance
- **Records List** — View all financial records with filtering options
- **Trends** — Monthly income/expense trends visualization
- **Category Breakdown** — View totals grouped by category

### Financial Records
- **Create Records** — Add new income/expense records (analyst/admin only)
- **Update Records** — Modify existing records (admin only)
- **Delete Records** — Soft-delete records (admin only)
- **Filter Records** — Filter by type, category, and date

### User Management (Admin Only)
- **List Users** — View all registered users
- **Update Roles** — Change user roles (viewer/analyst/admin)
- **Activate/Deactivate** — Enable or disable user accounts

---

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api`. All protected routes automatically include the JWT token from localStorage via an Axios interceptor.

### Token Management
```javascript
// Token is stored in localStorage on login
localStorage.setItem('token', res.data.token);

// Axios interceptor auto-attaches token to requests
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## Development

### Hot Module Replacement (HMR)
Vite provides instant hot module replacement for a smooth development experience. Changes to React components are reflected immediately without full page reloads.

### ESLint Configuration
The project uses ESLint with React-specific rules:
- `eslint-plugin-react-hooks` — Enforces React Hooks rules
- `eslint-plugin-react-refresh` — Ensures components are HMR-compatible

---

## UI Components

The application uses Tailwind CSS v4 for styling with a clean, responsive interface:
- **Forms** — Input fields for registration, login, and record creation
- **Tables** — Display records and user lists
- **Buttons** — Action buttons with hover states
- **Messages** — Toast-style notifications for user feedback
- **Tabs** — Switch between different views (Summary, Records, Users, etc.)

---

## Role-Based UI

The interface adapts based on user permissions:
- **Viewer** — Can view dashboard and records only
- **Analyst** — Can view and create records
- **Admin** — Full access including update/delete records and user management

Admin-only features (like user management) display access denied messages when accessed by non-admin users.

---

## Notes

- The app assumes the backend is running on `http://localhost:3000`
- JWT tokens are stored in browser localStorage
- Token is automatically included in all API requests via Axios interceptor
- Inactive users are blocked at the API level and will receive 403 Forbidden responses

