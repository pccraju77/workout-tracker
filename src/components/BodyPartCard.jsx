import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity } from 'lucide-react';

const BodyPartCard = ({ bodyPart, progress }) => {
    const { id, name, description, exercises } = bodyPart;
    const completedCount = exercises.filter(e => e.completed).length;
    // Note: 'completed' property in workouts.js is initial state. 
    // In real app, we'll pass 'progress' prop which is the count of completed exercises for this bodyPart.
    // We'll update this logic when connecting to state.

    // For now, let's use the 'progress' prop if available, or default to 0.
    // Wait, the prompt says "Display progress bar on home page for each body part".

    const totalExercises = exercises.length;
    const percentage = Math.round((progress / totalExercises) * 100) || 0;

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-1 border border-gray-700 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        {name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 h-10">
                        {description}
                    </p>
                </div>
                <div className="bg-gray-700 p-2 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                    <Activity className="h-5 w-5 text-emerald-500" />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                        {totalExercises} Exercises
                    </span>
                    <Link
                        to={`/workout/${id}`}
                        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <span>Start</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BodyPartCard;
