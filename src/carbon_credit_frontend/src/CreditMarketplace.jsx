import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search } from 'lucide-react';

// --- MOCK COMPANY DATA ---
const mockSellers = [
    {
        id: 'c1',
        name: 'EcoTech Industries',
        origin: 'Plant A (Industrial)',
        creditsAvailable: 1500,
        pricePerTonne: 750,
        verifiedBy: 'IoT + MRV Verified',
        type: 'industrial'
    },
    {
        id: 'c2',
        name: 'GreenOcean Restorations',
        origin: 'Project BC-001 (Blue Carbon)',
        creditsAvailable: 500,
        pricePerTonne: 720,
        verifiedBy: 'Satellite + MRV Verified',
        type: 'bluecarbon'
    },
    {
        id: 'c3',
        name: 'Sylva Carbon',
        origin: 'Project SC-04 (Reforestation)',
        creditsAvailable: 3500,
        pricePerTonne: 780,
        verifiedBy: 'Satellite + Drone Verified',
        type: 'forestry'
    },
    {
        id: 'c4',
        name: 'DirectAir Corp',
        origin: 'DAC Facility Beta',
        creditsAvailable: 200,
        pricePerTonne: 800,
        verifiedBy: 'IoT + 3rd Party Audited',
        type: 'dac'
    },
    {
        id: 'c5',
        name: 'AgriGreen Farms',
        origin: 'Soil C-Sequestration Co-op',
        creditsAvailable: 800,
        pricePerTonne: 700,
        verifiedBy: 'Soil Sampling + MRV',
        type: 'agriculture'
    }
];

const CreditMarketplace = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // --- FILTER AND SORT LOGIC ---
    // 1. Convert input to number. If empty, requested is 0.
    const requestedCredits = parseInt(searchQuery, 10) || 0;

    // 2. Filter: Company must have at least the requested amount of credits
    const availableSellers = mockSellers.filter(seller => seller.creditsAvailable >= requestedCredits);

    // 3. Sort: Cheapest price first
    const sortedSellers = [...availableSellers].sort((a, b) => a.pricePerTonne - b.pricePerTonne);

    // If search is empty or invalid, show Top 4 cheapest to act as default view
    const displaySellers = requestedCredits > 0 ? sortedSellers : sortedSellers.slice(0, 4);

    return (
        <section className="animate-fade-in">
            {/* Search Bar Row */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">Find Credits to Offset</h3>
                        <p className="text-sm text-slate-500 mt-1">Search for sellers who can fulfill your exact carbon offset requirement.</p>
                    </div>
                    <div className="mt-4 md:mt-0 relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="number"
                            min="1"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900"
                            placeholder="Enter tonnes of CO₂ to offset..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* Marketplace Listings */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Available Suppliers {requestedCredits > 0 && `(for ${requestedCredits}t CO₂ Credit)`}
                        </h3>
                        <span className="text-sm rounded-full bg-green-100 text-green-700 font-bold px-3 py-1">
                            {displaySellers.length} found
                        </span>
                    </div>

                    {displaySellers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="font-medium text-lg">No suppliers found.</p>
                            <p className="text-sm">Try reducing the amount of requested credits.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displaySellers.map((seller) => (
                                <div key={seller.id} className="border p-4 rounded-lg flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-slate-800 text-lg">{seller.name}</p>
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 border">
                                                Avail: {seller.creditsAvailable}t
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4 flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-2 bg-slate-300"></span>
                                            {seller.origin}
                                        </p>
                                        <div className="flex items-end justify-between mb-4">
                                            <p className="text-3xl font-extrabold text-green-600">₹{seller.pricePerTonne.toFixed(2)}<span className="text-sm font-medium text-slate-400"> / t</span></p>
                                        </div>
                                        <div className="flex items-center text-xs text-blue-600 font-semibold mb-4 bg-blue-50 p-2 rounded w-fit">
                                            <ShieldCheck className="w-4 h-4 mr-1 flex-shrink-0" /> {seller.verifiedBy}
                                        </div>
                                    </div>
                                    <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-150">
                                        Buy {requestedCredits > 0 ? requestedCredits : 'Credits'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CreditMarketplace;
