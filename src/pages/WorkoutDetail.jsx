import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Flame, ListFilter } from 'lucide-react';
import ExerciseCard from '../components/ExerciseCard';
import ProgressBar from '../components/ProgressBar';

const WorkoutDetail = ({
    workouts,
    completedExercises,
    onToggleComplete,
    customizations,
    onCustomize,
    selectedExercises,
    onToggleSelection
}) => {
    const { bodyPartId } = useParams();
    const workout = workouts.find(w => w.id === bodyPartId);

    if (!workout) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-white mb-4">Workout not found</h2>
                <Link to="/" className="text-emerald-500 hover:text-emerald-400">Back to Home</Link>
            </div>
        );
    }

    // Determine which exercises to show/count
    const currentSelections = selectedExercises[bodyPartId] || [];

    // If no exercises are selected manually, we default to ALL exercises being "active" 
    // OR we enforce selection. The prompt says "I can select any 5". 
    // Let's treat selection as a filter. If selection exists (>0), progress depends on it.
    const hasSelection = currentSelections.length > 0;

    // Exercises to count for progress
    const activeExercises = hasSelection
        ? workout.exercises.filter(e => currentSelections.includes(e.id))
        : workout.exercises;

    const completedCount = activeExercises.filter(e => completedExercises[e.id]).length;
    const totalExercises = activeExercises.length;
    const progress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

    // Calculate calories (for active exercises only)
    const totalCalories = activeExercises.reduce((acc, exercise) => {
        const isCompleted = completedExercises[exercise.id];
        if (isCompleted) {
            const customData = customizations[exercise.id] || {};
            const cals = customData.calories !== undefined ? customData.calories : exercise.calories;
            return acc + (cals || 0);
        }
        return acc;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center space-x-4 mb-8">
                <Link
                    to="/"
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">{workout.name} Workout</h1>
                    <p className="text-gray-400">{workout.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                            Progress {hasSelection ? '(Selected)' : '(All)'}
                        </h2>
                        <span className="text-emerald-500 font-mono font-bold">{progress}%</span>
                    </div>
                    <ProgressBar current={completedCount} total={totalExercises} label={`${completedCount}/${totalExercises} Exercises`} />
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Calories Burned</p>
                        <h3 className="text-3xl font-bold text-white font-mono">{totalCalories}</h3>
                    </div>
                    <div className="bg-orange-500/10 p-4 rounded-full">
                        <Flame className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {!hasSelection && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-start space-x-3">
                    <ListFilter className="h-5 w-5 text-blue-400 mt-0.5" />
                    <p className="text-blue-300 text-sm">
                        Tap the <strong>+</strong> button on any exercise to add it to your routine.
                        Select up to 5 exercises to focus on specific goals.
                    </p>
                </div>
            )}

            <div className="grid gap-6">
                {workout.exercises.map(exercise => {
                    const isSelected = currentSelections.includes(exercise.id);
                    // We show all exercises, but visually distinguish selected ones

                    return (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={{
                                ...exercise,
                                completed: !!completedExercises[exercise.id]
                            }}
                            customization={customizations[exercise.id]}
                            onToggleComplete={onToggleComplete}
                            onCustomize={onCustomize}
                            isSelected={isSelected}
                            onToggleSelect={(id) => onToggleSelection(bodyPartId, id)}
                            showSelectionControls={true}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default WorkoutDetail;
