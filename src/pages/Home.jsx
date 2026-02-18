import React from 'react';
import BodyPartCard from '../components/BodyPartCard';
import { Trophy, Flame, Calendar, Download, FileJson, Upload } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';

const Home = ({ workouts, completedExercises, customizations }) => {
    // Define the 6-day plan
    const schedule = [
        { id: 'chest', name: 'Chest' },
        { id: 'back', name: 'Back' },
        { id: 'triceps', name: 'Triceps' },
        { id: 'biceps', name: 'Biceps' },
        { id: 'shoulders', name: 'Shoulder' },
        { id: 'legs', name: 'Leg' }
    ];

    // Calculate finished days
    // A day is finished if Category exercises >= 5 AND Abs exercises >= 2
    const absWorkout = workouts.find(w => w.id === 'abs');
    const completedAbsCount = absWorkout ? absWorkout.exercises.filter(e => completedExercises[e.id]).length : 0;
    const isAbsGoalMet = completedAbsCount >= 2;

    const finishedDays = schedule.filter(day => {
        const workout = workouts.find(w => w.id === day.id);
        if (!workout) return false;
        const completedInCategory = workout.exercises.filter(e => completedExercises[e.id]).length;
        return completedInCategory >= 5 && isAbsGoalMet;
    }).length;

    const totalDaysGoal = 6;
    const globalProgress = Math.round((finishedDays / totalDaysGoal) * 100);

    // Calculate total calories burned
    const totalCaloriesBurned = workouts.reduce((acc, part) => {
        const partCalories = part.exercises.reduce((exAcc, exercise) => {
            if (completedExercises[exercise.id]) {
                const custom = customizations[exercise.id] || {};
                return exAcc + (custom.calories !== undefined ? custom.calories : exercise.calories);
            }
            return exAcc;
        }, 0);
        return acc + partCalories;
    }, 0);

    const totalPotentialCalories = React.useMemo(() => {
        return workouts.reduce((total, workout) => {
            return total + workout.exercises.reduce((acc, exercise) => acc + (exercise.calories || 0), 0);
        }, 0);
    }, [workouts]);

    const calorieGoal = totalPotentialCalories;
    const calorieProgress = Math.min(Math.round((totalCaloriesBurned / calorieGoal) * 100), 100);

    // Day-by-day status for the breakdown
    const dayStatus = schedule.map(day => {
        const workout = workouts.find(w => w.id === day.id);
        const count = workout ? workout.exercises.filter(e => completedExercises[e.id]).length : 0;
        return {
            ...day,
            count,
            isFinished: count >= 5 && isAbsGoalMet
        };
    });

    const handleExportJSON = () => {
        const data = {
            completedExercises,
            customizations,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workout_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImportJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.completedExercises) {
                    // We need to trigger App.jsx's setCompletedExercises
                    // Since App.jsx passes them as props, we might need a callback
                    // But wait, App.jsx manages the state.
                    // For now, I'll alert that this needs App level integration if I don't have the setter here.
                    // Actually, I should probably pass setters down or use a context.
                    // Let's check App.jsx again.
                    alert("Importing data... Please refresh after clicking OK.");
                    localStorage.setItem('workout-app-progress', JSON.stringify(data.completedExercises || {}));
                    localStorage.setItem('workout-app-customizations', JSON.stringify(data.customizations || {}));
                    if (data.selectedExercises) {
                        localStorage.setItem('workout-app-selections', JSON.stringify(data.selectedExercises));
                    }
                    window.location.reload();
                }
            } catch (err) {
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => exportToPDF(workouts, completedExercises, customizations)}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                </button>
                <button
                    onClick={handleExportJSON}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                >
                    <FileJson className="w-4 h-4" />
                    <span>Backup (JSON)</span>
                </button>
                <label className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors border border-gray-600">
                    <Upload className="w-4 h-4" />
                    <span>Restore</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>
            </div>
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <Trophy className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Progress</p>
                            <h3 className="text-2xl font-bold text-white">{globalProgress}%</h3>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-emerald-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-500"
                            style={{ width: `${globalProgress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-500/20 rounded-lg">
                            <Flame className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Calories Burned</p>
                            <h3 className="text-2xl font-bold text-white">{totalCaloriesBurned} <span className="text-sm font-normal text-gray-400">/ {calorieGoal} kcal</span></h3>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-orange-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-500"
                            style={{ width: `${calorieProgress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <Calendar className="h-8 w-8 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Weekly Goal</p>
                            <h3 className="text-2xl font-bold text-white">{finishedDays} / {totalDaysGoal} Days</h3>
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-wider flex justify-between">
                        <span>Rule: 5 Ex + 2 Abs</span>
                        <span className={isAbsGoalMet ? "text-emerald-500" : "text-amber-500"}>
                            {isAbsGoalMet ? "Abs Goal Met ✓" : "Abs Goal Pending"}
                        </span>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Flame className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Abs Progress</p>
                            <h3 className="text-2xl font-bold text-white">
                                {completedAbsCount} / 2 <span className="text-sm font-normal text-gray-400 pl-1">Daily</span>
                            </h3>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500"
                            style={{ width: `${Math.min((completedAbsCount / 2) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Day Status Breakdown */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">6-Day Schedule Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {dayStatus.map(day => (
                        <div
                            key={day.id}
                            className={`p-3 rounded-xl border transition-all ${day.isFinished
                                ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20"
                                : day.count > 0
                                    ? "bg-amber-500/5 border-amber-500/20"
                                    : "bg-gray-900/50 border-gray-700/50"
                                }`}
                        >
                            <p className="text-xs text-gray-400 mb-1">{day.name}</p>
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-bold ${day.isFinished ? "text-emerald-500" : "text-white"}`}>
                                    {day.count}/5
                                </span>
                                {day.isFinished && <div className="bg-emerald-500 rounded-full p-0.5"><Trophy className="w-3 h-3 text-white" /></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Choose Your Workout</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workouts.map(workout => {
                        const workoutCompletedCount = workout.exercises.filter(e => completedExercises[e.id]).length;
                        return (
                            <BodyPartCard
                                key={workout.id}
                                bodyPart={workout}
                                progress={workoutCompletedCount}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;
