import React from 'react';
import { Line } from 'react-chartjs-2';

const BlueCarbon = () => {
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

    return (
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
    );
};

export default BlueCarbon;
