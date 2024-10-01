// components/Visualizations/ColorsDistributionComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ColorsDistributionProps {
  brandsData: {
    models: {
      colors?: string[]; // Optional
    }[];
  }[];
}

const ColorsDistributionComponent: React.FC<ColorsDistributionProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    // Count occurrences of each color
    const colorCount: { [key: string]: number } = {};

    brandsData.forEach(brand => {
      brand.models.forEach(model => {
        model.colors?.forEach(color => {
          colorCount[color] = (colorCount[color] || 0) + 1;
        });
      });
    });

    const myChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(colorCount),
        datasets: [{
          label: 'Color Distribution',
          data: Object.values(colorCount),
          backgroundColor: [
            '#FF6384', // Red
            '#36A2EB', // Blue
            '#FFCE56', // Yellow
            '#4BC0C0', // Teal
            '#9966FF', // Purple
            '#FF9F40'  // Orange
            // Add more colors if needed
          ],
        }],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
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

export default ColorsDistributionComponent;
