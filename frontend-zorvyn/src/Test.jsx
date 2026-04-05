import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api';

// axios instance that auto-attaches token
const api = axios.create({ baseURL: API });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default function Test() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('login'); // login | register | dashboard
  const [msg, setMsg] = useState('');

  // Auth form state
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'viewer' });

  // Data state
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [trends, setTrends] = useState([]);
  const [byCategory, setByCategory] = useState([]);

  // New record form
  const [rec, setRec] = useState({ amount:'', type:'income', category:'salary', date:'', description:'' });

  const show = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // ── AUTH ──────────────────────────────────────────
  const handleRegister = async () => {
    try {
      await api.post('/auth/register', form);
      show('Registered! Now login.');
      setView('login');
    } catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setView('dashboard');
      show('Logged in!');
    } catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
    setSummary(null);
  };

  // ── DASHBOARD ─────────────────────────────────────
  const loadSummary = async () => {
    try { 
      const r = await api.get('/dashboard/summary'); 
      setSummary(r.data); 
    }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const loadRecords = async () => {
    try { 
      const r = await api.get('/records');
      setRecords(r.data); }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const loadUsers = async () => {
    try { 
      const r = await api.get('/users'); 
      setUsers(r.data); 
    }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const loadTrends = async () => {
    try { 
      const r = await api.get('/dashboard/trends'); 
      setTrends(r.data); 
    }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const loadByCategory = async () => {
    try { 
      const r = await api.get('/dashboard/by-category'); 
      setByCategory(r.data); 
    }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const createRecord = async () => {
    try {
      await api.post('/records', rec);
      show('Record created!');
      loadRecords();
    } catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  const deleteRecord = async (id) => {
    try { 
      await api.delete(`/records/${id}`); show('Deleted!'); loadRecords(); 
    }
    catch(e) { 
      show(e.response?.data?.message || 'Error'); 
    }
  };

  // ── SHARED CLASSES ────────────────────────────────
  const inputCls = "block w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black";
  const selectCls = "block w-full px-3 py-2 mb-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-black";
  const btnCls = "px-4 py-2 mr-2 mb-2 bg-black text-white text-sm rounded cursor-pointer hover:bg-gray-800";
  const btnRedCls = "px-3 py-1 bg-white text-black text-sm border border-black rounded cursor-pointer hover:bg-gray-100";
  const cardCls = "border border-gray-200 rounded-lg p-4 mb-4";
  const thCls = "bg-gray-100 px-3 py-2 text-left text-sm font-semibold border border-gray-200";
  const tdCls = "px-3 py-2 text-sm border border-gray-200";

  // ── RENDER: LOGIN / REGISTER ──────────────────────
  if (!token || view === 'login' || view === 'register') {
    return (
      <div className="max-w-xl mx-auto px-5 py-8 font-sans">
        <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>

        {msg && (
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-3 py-2 rounded mb-4">
            {msg}
          </div>
        )}

        <div className="flex gap-2 mb-5">
          <button className={btnCls} onClick={() => setView('login')}>Login</button>
          <button className={btnCls} onClick={() => setView('register')}>Register</button>
        </div>

        {view === 'register' && (
          <div className={cardCls}>
            <h3 className="text-lg font-semibold mb-3">Register</h3>
            <input className={inputCls} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input className={inputCls} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className={inputCls} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <select className={selectCls} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
            <button className={btnCls} onClick={handleRegister}>Register</button>
          </div>
        )}

        {view === 'login' && (
          <div className={cardCls}>
            <h3 className="text-lg font-semibold mb-3">Login</h3>
            <input className={inputCls} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className={inputCls} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button className={btnCls} onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER: DASHBOARD ─────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-5 py-8 font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        <button className={btnRedCls} onClick={handleLogout}>Logout</button>
      </div>

      {msg && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-3 py-2 rounded mb-4">
          {msg}
        </div>
      )}

      {/* ── Summary ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-semibold">Summary</h3>
          <button className={btnCls} onClick={loadSummary}>Load</button>
        </div>
        {summary && (
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Income</p>
              <p className="font-bold text-lg">₹{summary.totalIncome}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Expenses</p>
              <p className="font-bold text-lg">₹{summary.totalExpenses}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Balance</p>
              <p className="font-bold text-lg">₹{summary.netBalance}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── By Category ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-semibold">By Category</h3>
          <button className={btnCls} onClick={loadByCategory}>Load</button>
        </div>
        {byCategory.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thCls}>Category</th>
                <th className={thCls}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map(c => (
                <tr key={c._id}>
                  <td className={tdCls}>{c._id}</td>
                  <td className={tdCls}>{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Monthly Trends ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-semibold">Monthly Trends</h3>
          <button className={btnCls} onClick={loadTrends}>Load</button>
        </div>
        {trends.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thCls}>Year</th>
                <th className={thCls}>Month</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((t, i) => (
                <tr key={i}>
                  <td className={tdCls}>{t._id.year}</td>
                  <td className={tdCls}>{t._id.month}</td>
                  <td className={tdCls}>{t._id.type}</td>
                  <td className={tdCls}>{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Record ── */}
      <div className={cardCls}>
        <h3 className="text-base font-semibold mb-3">Create Record <span className="text-xs text-gray-400 font-normal">(admin / analyst only)</span></h3>
        <input className={inputCls} type="number" placeholder="Amount" value={rec.amount} onChange={e => setRec({...rec, amount: e.target.value})} />
        <select className={selectCls} value={rec.type} onChange={e => setRec({...rec, type: e.target.value})}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={selectCls} value={rec.category} onChange={e => setRec({...rec, category: e.target.value})}>
          {['food','health','education','transport','rent','salary','entertainment','other'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input className={inputCls} type="date" value={rec.date} onChange={e => setRec({...rec, date: e.target.value})} />
        <input className={inputCls} placeholder="Description (optional)" value={rec.description} onChange={e => setRec({...rec, description: e.target.value})} />
        <button className={btnCls} onClick={createRecord}>Create Record</button>
      </div>

      {/* ── Records List ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-semibold">Records</h3>
          <button className={btnCls} onClick={loadRecords}>Load</button>
        </div>
        {records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={thCls}>Amount</th>
                  <th className={thCls}>Type</th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Date</th>
                  <th className={thCls}>Description</th>
                  <th className={thCls}>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id}>
                    <td className={tdCls}>₹{r.amount}</td>
                    <td className={tdCls}>{r.type}</td>
                    <td className={tdCls}>{r.category}</td>
                    <td className={tdCls}>{new Date(r.date).toLocaleDateString()}</td>
                    <td className={tdCls}>{r.description || '-'}</td>
                    <td className={tdCls}>
                      <button className={btnRedCls} onClick={() => deleteRecord(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Users (admin only) ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-semibold">Users <span className="text-xs text-gray-400 font-normal">(admin only)</span></h3>
          <button className={btnCls} onClick={loadUsers}>Load</button>
        </div>
        {users.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thCls}>Name</th>
                <th className={thCls}>Email</th>
                <th className={thCls}>Role</th>
                <th className={thCls}>Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td className={tdCls}>{u.name}</td>
                  <td className={tdCls}>{u.email}</td>
                  <td className={tdCls}>{u.role}</td>
                  <td className={tdCls}>{u.isActive ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}