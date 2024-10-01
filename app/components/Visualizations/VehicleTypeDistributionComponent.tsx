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

    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(vehicleTypeCount),
        datasets: [{
          label: 'Vehicle Type Distribution',
          data: Object.values(vehicleTypeCount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
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
