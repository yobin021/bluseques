import React from 'react';

const Admin = () => {
    return (
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
    );
};

export default Admin;
