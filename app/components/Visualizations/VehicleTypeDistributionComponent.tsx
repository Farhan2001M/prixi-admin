// components/Visualizations/VehicleTypeDistributionComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface VehicleTypeDistributionProps {
  brandsData: {
    models: {
      vehicleType?: string; // Optional
    }[];
  }[];
}

// Function to generate distinct colors
const generateColors = (count: number) => {
  const colors: string[] = [];
  const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4B4CFF', '#FF6F61', '#45A1FF'];

  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

const VehicleTypeDistributionComponent: React.FC<VehicleTypeDistributionProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    const vehicleTypeCount: { [key: string]: number } = {};

    brandsData.forEach(brand => {
      brand.models.forEach(model => {
        const type = model.vehicleType || "Unknown"; // Default to "Unknown"
        vehicleTypeCount[type] = (vehicleTypeCount[type] || 0) + 1;
      });
    });

    const labels = Object.keys(vehicleTypeCount);
    const data = Object.values(vehicleTypeCount);
    const colors = generateColors(labels.length);

    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Vehicle Type Distribution',
          data,
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [brandsData]);

  return <canvas ref={canvasRef} />;
};

export default VehicleTypeDistributionComponent;
