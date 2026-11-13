// import React from 'react'; // React 17+ JSX transform handles this
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History as HistoryIcon, MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { useUser } from './context/UserContext';
import { Dashboard } from './pages/Dashboard';
import { TrackTaco } from './pages/TrackTaco';
import { History } from './pages/History';
import { FindTacos } from './pages/FindTacos';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';

function App() {
  const { currentUser, logout } = useUser();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌮</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Taco Tracker</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink to="/profile" className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <span style={{ fontSize: '0.9rem' }}>Hi, </span>
              <span className="text-accent" style={{ fontWeight: 'bold' }}>{currentUser.name}</span>
            </NavLink>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem' }}
              onClick={logout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <nav className="container" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/log" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <PlusCircle size={18} /> Track Taco
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <HistoryIcon size={18} /> History
          </NavLink>
          <NavLink to="/find" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={18} /> Find Tacos
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <UserIcon size={18} /> Profile
          </NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<TrackTaco />} />
          <Route path="/history" element={<History />} />
          <Route path="/find" element={<FindTacos />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
