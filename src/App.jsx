import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WorkoutDetail from './pages/WorkoutDetail';
import { workouts } from './data/workouts';

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  // Initialize state from localStorage
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem('workout-app-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [customizations, setCustomizations] = useState(() => {
    const saved = localStorage.getItem('workout-app-customizations');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedExercises, setSelectedExercises] = useState(() => {
    const saved = localStorage.getItem('workout-app-selections');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('workout-app-progress', JSON.stringify(completedExercises));
  }, [completedExercises]);

  useEffect(() => {
    localStorage.setItem('workout-app-customizations', JSON.stringify(customizations));
  }, [customizations]);

  useEffect(() => {
    localStorage.setItem('workout-app-selections', JSON.stringify(selectedExercises));
  }, [selectedExercises]);

  const toggleComplete = (exerciseId) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const updateExercise = (exerciseId, data) => {
    setCustomizations(prev => ({
      ...prev,
      [exerciseId]: data
    }));
  };

  const toggleSelection = (bodyPartId, exerciseId) => {
    setSelectedExercises(prev => {
      const currentSelections = prev[bodyPartId] || [];
      const isSelected = currentSelections.includes(exerciseId);

      let newSelections;
      if (isSelected) {
        newSelections = currentSelections.filter(id => id !== exerciseId);
      } else {
        if (currentSelections.length >= 5) {
          alert("You can only select up to 5 exercises for this workout.");
          return prev;
        }
        newSelections = [...currentSelections, exerciseId];
      }

      return {
        ...prev,
        [bodyPartId]: newSelections
      };
    });
  };

  const resetProgress = () => {
    if (window.confirm('Reset ALL progress, customizations, and selections? This cannot be undone.')) {
      // Clear specific keys
      localStorage.removeItem('workout-app-progress');
      localStorage.removeItem('workout-app-customizations');
      localStorage.removeItem('workout-app-selections');

      // Update state immediately
      setCompletedExercises({});
      setCustomizations({});
      setSelectedExercises({});

      // Force reload with a slightly longer delay to ensure storage sync
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-emerald-500/30">
        <Navbar onReset={resetProgress} />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  workouts={workouts}
                  completedExercises={completedExercises}
                  selectedExercises={selectedExercises}
                  customizations={customizations}
                />
              }
            />
            <Route
              path="/workout/:bodyPartId"
              element={
                <WorkoutDetail
                  workouts={workouts}
                  completedExercises={completedExercises}
                  onToggleComplete={toggleComplete}
                  customizations={customizations}
                  onCustomize={updateExercise}
                  selectedExercises={selectedExercises}
                  onToggleSelection={toggleSelection}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
