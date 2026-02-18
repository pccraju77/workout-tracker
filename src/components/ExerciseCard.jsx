import React, { useState } from 'react';
import { CheckCircle, Circle, Timer as TimerIcon, Edit2, Save, X, Flame, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import Timer from './Timer';

const ExerciseCard = ({ exercise, onToggleComplete, customization, onCustomize, isSelected, onToggleSelect, showSelectionControls }) => {
    // Merge prop exercise with customization
    const currentData = { ...exercise, ...customization };
    const { id, name, sets, reps, restTime, difficulty, completed, calories, images } = currentData;

    const [showTimer, setShowTimer] = useState(false);
    const [showImages, setShowImages] = useState(false); // Collapsed by default
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ sets, reps, calories });

    const handleSave = () => {
        onCustomize(id, editValues);
        setIsEditing(false);
    };

    const handleEditChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    // If selection controls are active and this item isn't selected, show a dimmed state
    const isDimmed = showSelectionControls && !isSelected;

    return (
        <div className={`bg-gray-800 rounded-xl p-5 border transition-all duration-300 ${completed ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
            isSelected ? 'border-emerald-500' : 'border-gray-700 shadow-lg'
            } ${isDimmed ? 'opacity-60 hover:opacity-100' : ''}`}>

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-lg font-bold ${completed ? 'text-emerald-400' : 'text-white'}`}>
                            {name}
                        </h3>
                        {showSelectionControls && (
                            <button
                                onClick={() => onToggleSelect(id)}
                                className={`p-1 rounded-full transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                title={isSelected ? "Remove from routine" : "Add to routine"}
                            >
                                {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${difficulty === 'Beginner' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                            difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                'border-red-500/30 text-red-400 bg-red-500/10'
                            }`}>
                            {difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full border border-orange-500/30 text-orange-400 bg-orange-500/10 flex items-center">
                            <Flame className="w-3 h-3 mr-1" />
                            {calories} kcal
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowImages(!showImages)}
                        className={`p-2 transition-colors ${showImages ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}
                        title="View Exercise Images"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                            title="Edit Workout"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={() => onToggleComplete(id)}
                        className={`transition-transform active:scale-90 focus:outline-none ${!isSelected && showSelectionControls ? 'invisible' : ''}`}
                        disabled={!isSelected && showSelectionControls}
                    >
                        {completed ? (
                            <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                            <Circle className="w-8 h-8 text-gray-500 hover:text-emerald-400" />
                        )}
                    </button>
                </div>
            </div>

            {showImages && images && (
                <div className="mb-4 animate-in fade-in duration-300 flex justify-center">
                    <div className="relative group w-full max-w-md">
                        <img src={images.start} alt={`${name} Demonstration`} className="rounded-lg w-full h-auto object-cover border border-gray-700 shadow-md" />
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="bg-gray-700/50 p-4 rounded-lg mb-4 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Sets</label>
                            <input
                                type="number"
                                value={editValues.sets}
                                onChange={(e) => handleEditChange('sets', parseInt(e.target.value) || 0)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Reps</label>
                            <input
                                type="text"
                                value={editValues.reps}
                                onChange={(e) => handleEditChange('reps', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">Calories</label>
                            <input
                                type="number"
                                value={editValues.calories}
                                onChange={(e) => handleEditChange('calories', parseInt(e.target.value) || 0)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 rounded text-xs font-medium text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500 transition-colors flex items-center"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 rounded text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center border border-transparent hover:border-gray-600 transition-colors">
                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Sets</p>
                        <p className="text-white font-mono text-lg">{sets}</p>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center border border-transparent hover:border-gray-600 transition-colors">
                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Reps</p>
                        <p className="text-white font-mono text-lg">{reps}</p>
                    </div>
                </div>
            )}

            {/* Only show timer input if selected or if no selection logic is active (backward compatibility) */}
            {(isSelected || !showSelectionControls) && (
                <>
                    <button
                        onClick={() => setShowTimer(!showTimer)}
                        className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-colors ${showTimer
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20'
                            }`}
                    >
                        <TimerIcon className="w-4 h-4" />
                        <span>{showTimer ? 'Hide Timer' : `Rest Timer (${restTime}s)`}</span>
                    </button>

                    {showTimer && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <Timer defaultTime={restTime} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExerciseCard;
