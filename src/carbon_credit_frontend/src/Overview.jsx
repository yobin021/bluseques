import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ArrowDownCircle, Award } from 'lucide-react';

const Overview = ({ stats }) => {
    const gaugeRef = useRef(null);

    // D3 Gauge Logic
    useEffect(() => {
        if (!gaugeRef.current) return;

        // Clear previous
        d3.select(gaugeRef.current).selectAll("*").remove();

        const container = d3.select(gaugeRef.current);
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

        const gaugeInterval = setInterval(() => {
            updateGauge(Math.random() * 80 + 10);
        }, 2000);

        updateGauge(65.2);

        return () => clearInterval(gaugeInterval);
    }, []); // Run once on component mount for real-time independence

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

    return (
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
    );
};

export default Overview;
