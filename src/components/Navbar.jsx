import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onReset }) => {
    return (
        <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Workout Planner
                        </span>
                    </Link>

                    <div className="hidden md:block">
                        <p className="text-gray-400 text-sm italic">
                            "Discipline is the bridge between goals and accomplishment."
                        </p>
                    </div>
                    <button
                        onClick={onReset}
                        className="ml-4 px-3 py-1 text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
