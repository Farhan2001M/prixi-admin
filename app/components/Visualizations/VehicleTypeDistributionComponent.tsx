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

// Define a color mapping for vehicle types
const vehicleTypeColors: { [key: string]: string } = {
  Sedan: '#000000',        // Red
  'Pickup-Truck': '#EEA200', // Blue
  Coupe: '#FFCE56',         // Yellow
  SUV: '#4BC0C0',           // Teal
  Hatchback: '#9966FF',     // Purple
  Compact: '#FF9F40',       // Orange
  Unknown: '#808080',      // Gray for unknown types
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
  
    const totalCount = data.reduce((sum, count) => sum + count, 0);
  
    // Map the colors based on the vehicle type
    const colors = labels.map(type => vehicleTypeColors[type] || vehicleTypeColors['Unknown']);
  
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
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const count = tooltipItem.raw as number;
                const percentage = ((count / totalCount) * 100).toFixed(2);
                return `${tooltipItem.label}: ${percentage}%`;
              },
            },
          },
        },
      },
    });
  
    return () => {
      myChart.destroy();
    };
  }, [brandsData]);
  

  return <canvas ref={canvasRef} className='w-full mx-auto' />;
};

export default VehicleTypeDistributionComponent;
