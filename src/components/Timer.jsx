import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

const Timer = ({ defaultTime = 60, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(defaultTime);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
            if (onComplete) onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(defaultTime);
    };

    const setTime = (time) => {
        setIsActive(false);
        setTimeLeft(time);
    };

    const progress = ((defaultTime - timeLeft) / defaultTime) * 100;

    return (
        <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 mt-4">
            <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            className="text-gray-600"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                        />
                        <circle
                            className="text-emerald-500 transition-all duration-1000 ease-linear"
                            strokeWidth="4"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * progress) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="48"
                            cy="48"
                        />
                    </svg>
                    <span className="absolute text-2xl font-bold text-white font-mono">
                        {timeLeft}s
                    </span>
                </div>

                <div className="flex space-x-2 mb-4">
                    {[30, 45, 60].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${timeLeft === t && !isActive
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                        >
                            {t}s
                        </button>
                    ))}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={toggleTimer}
                        className={`p-2 rounded-full transition-colors ${isActive
                                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
                            }`}
                    >
                        {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-2 rounded-full bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <audio
                ref={audioRef}
                src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
                preload="auto"
            />
        </div>
    );
};

export default Timer;
