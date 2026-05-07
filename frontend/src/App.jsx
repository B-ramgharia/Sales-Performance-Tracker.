import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-primary">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary"></div>
    </div>
  );

  return (
    <Router>
      <div className="flex min-h-screen bg-background text-primary">
        {user && <Sidebar user={user} setUser={setUser} />}
        <main className={`flex-1 transition-all duration-300 ${user ? 'ml-64' : ''}`}>
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
