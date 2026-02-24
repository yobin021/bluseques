import React from 'react';
import { Line } from 'react-chartjs-2';

const Report = () => {
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

    return (
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
    );
};

export default Report;
