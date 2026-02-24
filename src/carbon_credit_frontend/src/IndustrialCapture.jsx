import React from 'react';
import { Line } from 'react-chartjs-2';

const IndustrialCapture = ({ stats }) => {
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

    return (
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
    );
};

export default IndustrialCapture;
