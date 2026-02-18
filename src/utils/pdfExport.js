import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (workouts, completedExercises, customizations) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text('Workout Progress Summary', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Filter completed exercises
    const allExercises = workouts.flatMap(w => w.exercises.map(e => ({ ...e, bodyPart: w.name })));
    const completedList = allExercises.filter(e => completedExercises[e.id]);

    if (completedList.length === 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('No exercises completed yet.', 14, 45);
    } else {
        const tableData = completedList.map(e => {
            const custom = customizations[e.id] || {};
            return [
                e.bodyPart,
                e.name,
                custom.sets || e.sets,
                custom.reps || e.reps,
                `${custom.calories || e.calories} kcal`
            ];
        });

        autoTable(doc, {
            startY: 40,
            head: [['Body Part', 'Exercise', 'Sets', 'Reps', 'Calories']],
            body: tableData,
            headStyles: { fillColor: [16, 185, 129] },
            alternateRowStyles: { fillColor: [240, 253, 244] },
        });

        // Add total calories
        const totalCalories = completedList.reduce((acc, e) => {
            const custom = customizations[e.id] || {};
            return acc + (custom.calories !== undefined ? custom.calories : e.calories);
        }, 0);

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Calories Burned: ${totalCalories} kcal`, 14, finalY);
    }

    // Save the PDF
    doc.save('My_Workout_Summary.pdf');
};
