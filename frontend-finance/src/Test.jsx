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
  const [form, setForm] = useState({ name:'', email:'', password:'' });

  // Data state
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');
  const [roleEdits, setRoleEdits] = useState({});
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
    try {
      await api.post('/auth/logout');
    } catch(e) {
      console.error(e);
    }
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
    catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const loadRecords = async () => {
    try { 
      const r = await api.get('/records');
      setRecords(r.data); 
    }
    catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const loadUsers = async () => {
    try { 
      setUsersError('');
      const r = await api.get('/users'); 
      setUsers(r.data); 
    }
    catch(e) { 
      if(e.response?.status === 403) {
        setUsersError('Access Denied: You do not have permission to view or manage users.');
      } else {
        show(e.response?.data?.message || 'Error'); 
      }
    }
  };

  const updateRole = async (id) => {
    const newRole = roleEdits[id];
    if (!newRole) return; // Not changed or already saved
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      show('Role updated successfully!');
      // Clear edit state for this user
      setRoleEdits(prev => { const n = {...prev}; delete n[id]; return n; });
      loadUsers();
    } catch(e) { show(e.response?.data?.message || 'Error updating role'); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/users/${id}/status`, { isActive: newStatus });
      show('Status updated successfully!');
      loadUsers();
    } catch(e) { show(e.response?.data?.message || 'Error updating status'); }
  };

  const loadTrends = async () => {
    try { 
      const r = await api.get('/dashboard/trends'); 
      setTrends(r.data); 
    }
    catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const loadByCategory = async () => {
    try { 
      const r = await api.get('/dashboard/by-category'); 
      setByCategory(r.data); 
    }
    catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const createRecord = async () => {
    try {
      await api.post('/records', rec);
      show('Record created!');
      loadRecords();
    } catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  const deleteRecord = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try { 
      await api.delete(`/records/${id}`); 
      show('Deleted!'); 
      loadRecords(); 
    }
    catch(e) { show(e.response?.data?.message || 'Error'); }
  };

  // ── SHARED CLASSES ────────────────────────────────
  const inputCls = "block w-full px-4 py-2.5 mb-4 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent";
  const selectCls = "block w-full px-4 py-2.5 mb-4 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none";
  const btnCls = "inline-flex items-center justify-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  const btnOutlineCls = "inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-800 text-sm font-medium border border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:bg-gray-50 hover:border-black active:scale-95";
  const btnDangerOutlineCls = "inline-flex items-center justify-center px-3 py-1.5 bg-white text-red-600 text-xs font-semibold uppercase tracking-wider border border-red-200 rounded-lg transition-all duration-200 hover:bg-red-50 hover:border-red-300 active:scale-95";
  const cardCls = "bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]";
  const thCls = "bg-gray-50/50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100";
  const tdCls = "px-4 py-4 text-sm text-gray-700 border-b border-gray-50/50 whitespace-nowrap transition-colors";
  
  // ── RENDER: LOGIN / REGISTER ──────────────────────
  if (!token || view === 'login' || view === 'register') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-500">


        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {msg && (
            <div className="mb-4 bg-black text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-fade-in-down border border-gray-800 flex items-center justify-between">
              {msg}
            </div>
          )}

          <div className="bg-white py-8 px-4 shadow-[0_20px_40px_rgb(0,0,0,0.08)] sm:rounded-3xl sm:px-10 border border-gray-100">
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'login' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`} 
                onClick={() => setView('login')}
              >
                Login
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'register' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`} 
                onClick={() => setView('register')}
              >
                Register
              </button>
            </div>

            {view === 'register' && (
              <div className="animate-fade-in">
                <input className={inputCls} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input className={inputCls} placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input className={inputCls} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button className={`${btnCls} w-full mt-2`} onClick={handleRegister}>Create account</button>
              </div>
            )}

            {view === 'login' && (
              <div className="animate-fade-in">
                <input className={inputCls} placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input className={inputCls} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button className={`${btnCls} w-full mt-2`} onClick={handleLogin}>Sign in</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: DASHBOARD ─────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
          <button className={btnOutlineCls} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in-up">
        
        {/* Floating Notification */}
        {msg && (
          <div className="fixed top-6 right-6 z-50 bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium text-sm">{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ── Summary ── */}
            <section className={cardCls}>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Financial Overview</h3>
                  <p className="text-sm text-gray-500 mt-1">Your net balance across all accounts.</p>
                </div>
                <button className={btnOutlineCls} onClick={loadSummary}>Refresh</button>
              </div>
              
              {summary ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                      <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 relative z-10">Income</p>
                    <p className="font-extrabold text-3xl text-gray-900 relative z-10">₹{summary.totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                      <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 relative z-10">Expenses</p>
                    <p className="font-extrabold text-3xl text-gray-900 relative z-10">₹{summary.totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="bg-black text-white rounded-2xl p-6 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-xs font-medium text-gray-300 uppercase tracking-widest mb-2 relative z-10">Net Balance</p>
                    <p className="font-extrabold text-3xl relative z-10">₹{summary.netBalance.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p>Click refresh to load summary data.</p>
                </div>
              )}
            </section>

            {/* ── Records List ── */}
            <section className={cardCls}>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
                  <p className="text-sm text-gray-500 mt-1">A detailed list of your financial activity.</p>
                </div>
                <button className={btnOutlineCls} onClick={loadRecords}>Refresh</button>
              </div>
              
              {records.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr>
                          <th className={thCls}>Date</th>
                          <th className={thCls}>Description</th>
                          <th className={thCls}>Category</th>
                          <th className={thCls}>Amount</th>
                          <th className={thCls}></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {records.map(r => (
                          <tr key={r._id} className="hover:bg-gray-50 transition-colors group">
                            <td className={tdCls}>
                              <span className="text-gray-500 font-medium">{new Date(r.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year:'numeric'})}</span>
                            </td>
                            <td className={tdCls}>
                              <div className="font-medium text-gray-900">{r.description || '-'}</div>
                            </td>
                            <td className={tdCls}>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 capitalize border border-gray-200">
                                {r.category}
                              </span>
                            </td>
                            <td className={`${tdCls} font-bold ${r.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                              {r.type === 'income' ? '+' : '-'}₹{r.amount.toLocaleString()}
                            </td>
                            <td className={`${tdCls} text-right`}>
                              <button className={`${btnDangerOutlineCls} opacity-0 group-hover:opacity-100 focus:opacity-100`} onClick={() => deleteRecord(r._id)}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p>No transactions found.</p>
                </div>
              )}
            </section>
            
            {/* ── Users (admin only) ── */}
            <section className={cardCls}>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">User Administration</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage system access (Admin only).</p>
                </div>
                <button className={btnOutlineCls} onClick={loadUsers}>Load Users</button>
              </div>
              
              {usersError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <div>
                    <h4 className="font-bold text-sm">Access Denied</h4>
                    <p className="text-sm text-red-600 mt-1">{usersError}</p>
                  </div>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr>
                          <th className={thCls}>User</th>
                          <th className={thCls}>Role</th>
                          <th className={thCls}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50">
                            <td className={tdCls}>
                              <div className="font-bold text-gray-900">{u.name}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className={tdCls}>
                              <div className="flex flex-col gap-2 relative">
                                <select 
                                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-black focus:border-black block w-full p-2 transition-colors cursor-pointer appearance-none"
                                  value={roleEdits[u._id] || u.role}
                                  onChange={(e) => setRoleEdits({...roleEdits, [u._id]: e.target.value})}
                                >
                                  <option value="viewer">Viewer</option>
                                  <option value="analyst">Analyst</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <div className="pointer-events-none absolute top-2 right-2 flex items-center text-gray-500">
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                                {roleEdits[u._id] && roleEdits[u._id] !== u.role && (
                                  <button
                                    className="px-2 py-1 bg-black text-white text-[10px] uppercase font-bold rounded shadow hover:bg-gray-800 transition-all"
                                    onClick={() => updateRole(u._id)}
                                  >
                                    Save
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className={tdCls}>
                              <div className="flex items-center gap-3">
                                {u.isActive ? 
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 w-24 justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                  </span> : 
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 w-24 justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactive
                                  </span>
                                }
                                <button 
                                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                                    u.isActive 
                                      ? "bg-white border-red-200 text-red-600 hover:bg-red-50" 
                                      : "bg-white border-green-200 text-green-600 hover:bg-green-50"
                                  }`}
                                  onClick={() => updateStatus(u._id, !u.isActive)}
                                >
                                  {u.isActive ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                  Click 'Load Users' to fetch the user list (requires admin privileges).
                </div>
              )}
            </section>

          </div>

          {/* Sidebar / Tools Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* ── Create Record ── */}
            <section className={`${cardCls} bg-gray-900 text-white border-none shadow-xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none"></div>
              
              <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">Add Transaction</h3>
              <p className="text-sm text-gray-400 mb-6 relative z-10">Create a new entry. Requires analyst or admin privileges.</p>
              
              <div className="relative z-10 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Amount (₹)</label>
                  <input className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all" type="number" placeholder="e.g. 5000" value={rec.amount} onChange={e => setRec({...rec, amount: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Type</label>
                    <div className="relative">
                      <select className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white transition-all appearance-none" value={rec.type} onChange={e => setRec({...rec, type: e.target.value})}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                    <div className="relative">
                      <select className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white transition-all appearance-none" value={rec.category} onChange={e => setRec({...rec, category: e.target.value})}>
                        {['food','health','education','transport','rent','salary','entertainment','other'].map(c => (
                          <option key={c} value={c} className="capitalize">{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Date</label>
                  <input className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white transition-all custom-calendar-icon" type="date" value={rec.date} onChange={e => setRec({...rec, date: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Description (Optional)</label>
                  <input className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" placeholder="What was this for?" value={rec.description} onChange={e => setRec({...rec, description: e.target.value})} />
                </div>
                
                <button className="w-full inline-flex items-center justify-center px-5 py-3 mt-4 bg-white text-black font-bold rounded-xl transition-all shadow-md hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-95" onClick={createRecord}>
                  Submit Record
                </button>
              </div>
            </section>

            {/* ── By Category ── */}
            <section className={cardCls}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">By Category</h3>
                <button className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors border border-gray-200" onClick={loadByCategory}>Load</button>
              </div>
              
              {byCategory.length > 0 ? (
                <div className="space-y-3">
                  {byCategory.map(c => (
                    <div key={c._id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors">
                      <span className="font-medium text-gray-700 capitalize text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-black"></span>
                        {c._id}
                      </span>
                      <span className="font-bold text-gray-900">₹{c.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-6 text-gray-400 text-sm">
                   Refresh to view category breakdown.
                 </div>
              )}
            </section>

            {/* ── Monthly Trends ── */}
            <section className={cardCls}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Trends</h3>
                <button className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors border border-gray-200" onClick={loadTrends}>Load</button>
              </div>
              
              {trends.length > 0 ? (
                <div className="space-y-4">
                  {trends.map((t, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{t._id.month}/{t._id.year}</div>
                        <div className="text-xs text-gray-500 capitalize">{t._id.type}</div>
                      </div>
                      <div className={`font-bold ${t._id.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                        {t._id.type === 'income' ? '+' : '-'}₹{t.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Refresh to view recent trends.
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.4s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
        }
      `}} />
    </div>
  );
}