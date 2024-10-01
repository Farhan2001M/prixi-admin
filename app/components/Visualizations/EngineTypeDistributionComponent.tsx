// components/Visualizations/EngineTypeDistributionComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface EngineTypeDistributionProps {
  brandsData: {
    models: {
      engineType?: string; // Optional
    }[];
  }[];
}

const EngineTypeDistributionComponent: React.FC<EngineTypeDistributionProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    const engineTypeCount: { [key: string]: number } = {};

    brandsData.forEach(brand => {
      brand.models.forEach(model => {
        const type = model.engineType || "Unknown"; // Default to "Unknown"
        engineTypeCount[type] = (engineTypeCount[type] || 0) + 1;
      });
    });

    const colors: { [key: string]: string } = {
      Diesel: '#FFD700', // Yellow
      Hybrid: '#0000FF', // Blue
      Electric: '#00FF00', // Green
      Petrol: '#000000', // Black
      Unknown: '#808080' // Gray for unknown types
    };    

    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(engineTypeCount),
        datasets: [{
          label: 'Engine Type Distribution',
          data: Object.values(engineTypeCount),
          backgroundColor: Object.keys(engineTypeCount).map(type => colors[type as keyof typeof colors] || '#808080'), // Use specific colors
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

export default EngineTypeDistributionComponent;