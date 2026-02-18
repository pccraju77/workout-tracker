import React from 'react';

const ProgressBar = ({ current, total, label = "Progress" }) => {
    const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100))) || 0;

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-xs text-emerald-400 font-mono">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
