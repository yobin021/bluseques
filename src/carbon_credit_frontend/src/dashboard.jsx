import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  LayoutDashboard,
  Factory,
  Leaf,
  ShoppingCart,
  FileBarChart2,
  Shield,
  LogOut,
  ArrowDownCircle,
  Award,
  ShieldCheck
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // --- State Management ---
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState({ fullname: 'Guest' });
  
  // Real-time Stats State
  const [stats, setStats] = useState({
    totalCo2: 152340,
    realTimeCo2: 415.0,
    flowRate: 1200,
    temperature: 85.0,
    efficiency: 92.5
  });

  // Blockchain Feed State
  const [blockchainFeed, setBlockchainFeed] = useState([]);

  // Refs for D3
  const gaugeRef = useRef(null);

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

  // 3. Blockchain Feed Simulation
  useEffect(() => {
    const actions = ['Issued', 'Traded', 'Retired'];
    const types = ['Industrial', 'Blue Carbon'];
    
    const interval = setInterval(() => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Math.floor(Math.random() * 500) + 10;
      const color = action === 'Issued' ? 'green' : (action === 'Traded' ? 'blue' : 'slate');
      const txHash = Math.random().toString(16).substr(-6);

      const newTx = {
        id: Date.now(),
        amount,
        type,
        action,
        color,
        txHash
      };

      setBlockchainFeed(prev => [newTx, ...prev].slice(0, 10)); // Keep last 10
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 4. D3 Gauge Logic
  useEffect(() => {
    if (!gaugeRef.current) return;

    // Clear previous
    d3.select(gaugeRef.current).selectAll("*").remove();

    const container = d3.select(gaugeRef.current);
    // Get dimensions (mocked for stability or dynamic)
    const width = 300; 
    const height = 150; 
    const radius = Math.min(width, height * 2) / 2;
    const barWidth = radius * 0.2;

    const svg = container
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);

    const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI / 2, Math.PI / 2]);
    const arc = d3.arc().startAngle(scale(0)).endAngle(scale(100)).innerRadius(radius - barWidth).outerRadius(radius);

    svg.append("path").attr("d", arc).attr("fill", "#e5e7eb");

    const progressArc = d3.arc().innerRadius(radius - barWidth).outerRadius(radius).startAngle(scale(0));
    
    // Needle
    const needle = svg.append("path")
        .attr("fill", "#1e3a8a")
        .attr("d", `M ${-barWidth * 0.1} 0 L 0 ${-radius + barWidth * 0.5} L ${barWidth * 0.1} 0 z`);

    const valueText = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", `${radius * 0.25}px`)
        .style("font-weight", "bold")
        .style("fill", "#1f2937")
        .text("0.0");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", `${radius * 0.12}px`)
        .style("fill", "#6b7280")
        .text("tonnes/hour");

    // Update function (internal to effect)
    const updateGauge = (value) => {
        const angle = (value / 100) * 180 - 90;
        needle.transition().duration(500).attr("transform", `rotate(${angle})`);
        valueText.text(value.toFixed(1));

        const progressValue = scale(value);
        const foreground = svg.selectAll(".foreground-arc").data([value]);

        foreground.enter()
            .append("path")
            .attr("class", "foreground-arc")
            .attr("fill", "#2563eb")
            .merge(foreground)
            .transition().duration(500)
            .attrTween("d", function (d) {
                const interpolate = d3.interpolate(this._current || scale(0), progressValue);
                this._current = progressValue;
                return function (t) {
                    return progressArc.endAngle(interpolate(t))();
                };
            });
    };

    // Simulate gauge update inside this effect for simplicity or separate it
    const gaugeInterval = setInterval(() => {
        updateGauge(Math.random() * 80 + 10);
    }, 2000);
    
    updateGauge(65.2); // Initial

    return () => clearInterval(gaugeInterval);
  }, [activeSection]); // Re-run if section changes to ensure SVG renders

  // --- Chart Data Configurations ---
  const utilizationData = {
    labels: ['Methanol', 'Urea', 'Building Materials', 'Algae'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  const blueCarbonData = {
    labels: ['Pichavaram Mangroves', 'Sundarbans Restoration', 'Gulf of Mannar Seagrass', 'Chilika Lake Wetlands'],
    datasets: [{
      label: 'Tonnes CO₂ Sequestered',
      data: [12500, 21000, 8500, 15000],
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }]
  };

  const co2TrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'CO₂ Captured (tonnes)',
      data: [18000, 22000, 19000, 25000, 28000, 26000, 31000],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const carbonStockData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      label: 'Total Tonnes Stored',
      data: [25000, 35000, 50000, 72000, 95000],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  const aiPredictionData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Projected Capture',
      data: [110000, 125000, 140000, 160000],
      borderColor: '#8b5cf6',
      borderDash: [5, 5],
      fill: false
    }, {
      label: 'Actual Capture (YTD)',
      data: [105000, 122000],
      borderColor: '#8b5cf6',
      fill: false
    }]
  };

  const marketTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Price ($/tonne)',
      data: [15.5, 16, 15.8, 17.2, 18.5, 18.2],
      borderColor: '#f97316',
      tension: 0.1
    }]
  };

  // --- Helper to Render Sidebar Links ---
  // UPDATED: Used <button> and removed href for better React handling
  const NavLink = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
        activeSection === id 
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
        
        {/* UPDATED: Added flex-col and space-y-2 for vertical stacking */}
        <nav className="flex-grow flex flex-col space-y-2">
          <NavLink id="overview" icon={LayoutDashboard} label="Overview" />
          <NavLink id="industrial" icon={Factory} label="Industrial Capture" />
          <NavLink id="bluecarbon" icon={Leaf} label="Blue Carbon" />
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
          <h1 className="text-3xl font-bold text-slate-800">Carbon Capture & Blue Carbon MRV Platform</h1>
          <p className="text-slate-500 mt-1">Real-time monitoring, verification, and reporting dashboard.</p>
        </header>

        <div id="content-area">
          
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <ArrowDownCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Total CO₂ Captured</p>
                      <p className="text-2xl font-bold text-slate-800">{Math.round(stats.totalCo2).toLocaleString()} tonnes</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Total Credits Issued</p>
                      <p className="text-2xl font-bold text-slate-800">{Math.round(stats.totalCo2).toLocaleString()} Credits</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2 transition hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Live Capture Rate</h3>
                  <div className="relative w-full pt-[50%]">
                    <svg ref={gaugeRef} className="absolute top-0 left-0 w-full h-full"></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Utilization Split</h3>
                  <div className="w-full h-64 flex items-center justify-center">
                    <Doughnut data={utilizationData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Blue Carbon Contribution (tonnes CO₂)</h3>
                  <div className="w-full h-64">
                    <Bar data={blueCarbonData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* INDUSTRIAL SECTION */}
          {activeSection === 'industrial' && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Stack Monitoring Panel</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-600">Real-time CO₂</span>
                      <span className="font-bold text-lg text-blue-600">{stats.realTimeCo2.toFixed(1)} ppm</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-600">Flow Rate</span>
                      <span className="font-bold text-lg text-slate-800">{stats.flowRate.toFixed(0)} m³/h</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-600">Temperature</span>
                      <span className="font-bold text-lg text-slate-800">{stats.temperature.toFixed(1)} °C</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-600">Efficiency</span>
                      <span className="font-bold text-lg text-green-600">{stats.efficiency.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">IoT Integration: Plant Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-green-300 bg-green-50">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                        <span className="font-semibold text-green-800">Plant A</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Online</p>
                    </div>
                    <div className="p-4 rounded-lg border border-green-300 bg-green-50">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                        <span className="font-semibold text-green-800">Plant B</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Online</p>
                    </div>
                    <div className="p-4 rounded-lg border border-red-300 bg-red-50">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
                        <span className="font-semibold text-red-800">Plant C</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Offline</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">CO₂ Captured Over Time</h3>
                <div className="w-full h-80">
                  <Line data={co2TrendData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </section>
          )}

          {/* BLUE CARBON SECTION */}
          {activeSection === 'bluecarbon' && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Restoration Sites Map View</h3>
                  <div className="bg-slate-200 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-slate-500">Map Placeholder (Google Maps API required)</p>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-4">Satellite Data: Biomass Growth (NDVI)</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600">Sundarbans Mangrove Forest</p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-right text-slate-500 mt-1">75% Growth Trend</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Carbon Stock Growth Over Time</h3>
                  <div className="w-full h-96">
                    <Line data={carbonStockData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Status</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                      <tr>
                        <th className="px-6 py-3">Project ID</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Area (ha)</th>
                        <th className="px-6 py-3">Credits Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <th className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">BC-001</th>
                        <td className="px-6 py-4">Pichavaram, TN</td>
                        <td className="px-6 py-4">250</td>
                        <td className="px-6 py-4">12,500</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <th className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">BC-002</th>
                        <td className="px-6 py-4">Bhitarkanika, OD</td>
                        <td className="px-6 py-4">400</td>
                        <td className="px-6 py-4">21,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* MARKETPLACE SECTION */}
          {activeSection === 'marketplace' && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Carbon Credit Marketplace</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Credit Card */}
                    <div className="border p-4 rounded-lg">
                      <p className="font-bold text-slate-800">Industrial Capture Credit</p>
                      <p className="text-sm text-slate-500">Origin: Plant A</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">$15.50 / tonne</p>
                      <div className="flex items-center text-xs text-blue-600 font-semibold mt-1">
                        <ShieldCheck className="w-4 h-4 mr-1" /> IoT + MRV Verified
                      </div>
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Buy Credits</button>
                    </div>
                    {/* Credit Card */}
                    <div className="border p-4 rounded-lg">
                      <p className="font-bold text-slate-800">Blue Carbon Credit</p>
                      <p className="text-sm text-slate-500">Origin: Project BC-001</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">$22.00 / tonne</p>
                      <div className="flex items-center text-xs text-blue-600 font-semibold mt-1">
                        <ShieldCheck className="w-4 h-4 mr-1" /> Satellite + MRV Verified
                      </div>
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Buy Credits</button>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Blockchain Feed</h3>
                  <ul className="space-y-3 h-48 overflow-y-auto custom-scrollbar">
                    {blockchainFeed.map((tx) => (
                      <li key={tx.id} className="text-sm flex justify-between items-center animate-pulse-once">
                        <div>
                          <p className="font-medium text-slate-700">{tx.amount} {tx.type} Credits</p>
                          <p className="text-xs text-slate-400">Tx: 0x...{tx.txHash}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          tx.color === 'green' ? 'text-green-600 bg-green-100' : 
                          tx.color === 'blue' ? 'text-blue-600 bg-blue-100' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {tx.action}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* REPORTS SECTION */}
          {activeSection === 'reports' && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">AI Prediction: CO₂ Capture (Next 12 Months)</h3>
                  <div className="w-full h-80">
                    <Line data={aiPredictionData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Carbon Market Trends (Credit Price)</h3>
                  <div className="w-full h-80">
                    <Line data={marketTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Download Stakeholder Reports</h3>
                <div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2">Download PDF</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download Excel</button>
                </div>
              </div>
            </section>
          )}

          {/* ADMIN SECTION */}
          {activeSection === 'admin' && (
            <section className="text-center animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
                <p className="text-slate-500 mt-2">Manage user roles and system settings.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-slate-700">Government Login</h4>
                    <p className="text-sm text-slate-500">Access regulatory & policy compliance dashboards.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-slate-700">Industry Login</h4>
                    <p className="text-sm text-slate-500">View plant-wise emissions and credits earned.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-slate-700">NGO/Community Login</h4>
                    <p className="text-sm text-slate-500">Monitor blue carbon project progress.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;