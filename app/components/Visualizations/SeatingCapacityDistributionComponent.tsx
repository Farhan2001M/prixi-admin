// components/Visualizations/SeatingCapacityDistributionComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface SeatingCapacityDistributionProps {
  brandsData: {
    models: {
      seatingCapacity?: number; // Optional
    }[];
  }[];
}

const SeatingCapacityDistributionComponent: React.FC<SeatingCapacityDistributionProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    // Count occurrences of each seating capacity
    const capacityCount: { [key: number]: number } = {};

    brandsData.forEach(brand => {
      brand.models.forEach(model => {
        const capacity = model.seatingCapacity ?? 0; // Default to 0 if undefined
        capacityCount[capacity] = (capacityCount[capacity] || 0) + 1;
      });
    });

    const capacities = Object.keys(capacityCount).map(Number);
    const counts = capacities.map(capacity => capacityCount[capacity]);

    const myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: capacities.map(capacity => `Seats: ${capacity}`), // Label each capacity
        datasets: [{
          label: 'Seating Capacity Distribution',
          data: counts,
          backgroundColor: '#36A2EB', // Light blue fill
          borderColor: '#36A2EB',// Blue line
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Step size for the ticks
            },
          },
        },
        elements: {
          line: {
            tension: 0.4, // Smoothness of the line
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [brandsData]);

  return <canvas ref={canvasRef} />;
};

export default SeatingCapacityDistributionComponent;
