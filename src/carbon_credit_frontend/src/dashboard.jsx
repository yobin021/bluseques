import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Factory,
  Leaf,
  ShoppingCart,
  FileBarChart2,
  Shield,
  LogOut,
} from 'lucide-react';

import Overview from './Overview.jsx';
import IndustrialCapture from './IndustrialCapture.jsx';
// import BlueCarbon from './BlueCarbon.jsx';
import CreditMarketplace from './CreditMarketplace.jsx';
import Report from './Report.jsx';
import Admin from './Admin.jsx';

const Dashboard = () => {
  // --- State Management ---
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState({ fullname: 'Guest' });

  // Real-time Stats State (Keep in parent as it's passed to multiple children)
  const [stats, setStats] = useState({
    totalCo2: 152340,
    realTimeCo2: 415.0,
    flowRate: 1200,
    temperature: 85.0,
    efficiency: 92.5
  });

  // --- Effects ---

  // 1. Authentication Check
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect if not logged in
      // window.location.href = 'signin.html'; // Uncomment to enable strict auth
    }
  }, []);

  // 2. Real-time Data Simulation (Intervals)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalCo2: prev.totalCo2 + Math.random() * 5,
        realTimeCo2: 415 + Math.random() * 5,
        flowRate: 1200 + Math.random() * 20 - 10,
        temperature: 85 + Math.random() * 2 - 1,
        efficiency: 92.5 + Math.random() * 1 - 0.5
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Helper to Render Sidebar Links ---
  const NavLink = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center px-4 py-3 rounded-md font-medium transition-colors duration-200 ${activeSection === id
        ? 'bg-blue-900 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-left">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-slate-50 text-slate-800">

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col p-4 transition-all duration-300">
        <div className="flex items-center mb-8">
          <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">Carbon MRV</h1>
            <p className="text-xs text-blue-400 font-medium mt-1">Welcome, {user.fullname}</p>
          </div>
        </div>

        <nav className="flex-grow flex flex-col space-y-2">
          <NavLink id="overview" icon={LayoutDashboard} label="Overview" />
          <NavLink id="industrial" icon={Factory} label="Industrial Capture" />
          {/* <NavLink id="bluecarbon" icon={Leaf} label="Blue Carbon" /> */}
          <NavLink id="marketplace" icon={ShoppingCart} label="Credits Marketplace" />
          <NavLink id="reports" icon={FileBarChart2} label="Reports" />
          <NavLink id="admin" icon={Shield} label="Admin" />
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              sessionStorage.removeItem('user');
              window.location.href = 'signin.html';
            }}
            className="w-full flex items-center px-4 py-3 mb-4 text-red-400 font-medium hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
          <div className="p-4 rounded-lg bg-slate-800 text-center">
            <p className="text-sm">Need help?</p>
            <a href="#" className="text-sm font-semibold text-blue-400 hover:text-blue-300">Contact Support</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Carbon Capture & Carbon Monitoring System</h1>
          <p className="text-slate-500 mt-1">Real-time monitoring, verification, and reporting dashboard.</p>
        </header>

        <div id="content-area">
          {activeSection === 'overview' && <Overview stats={stats} />}
          {activeSection === 'industrial' && <IndustrialCapture stats={stats} />}
          {activeSection === 'bluecarbon' && <BlueCarbon />}
          {activeSection === 'marketplace' && <CreditMarketplace />}
          {activeSection === 'reports' && <Report />}
          {activeSection === 'admin' && <Admin />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;