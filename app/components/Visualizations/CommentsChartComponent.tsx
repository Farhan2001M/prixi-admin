// components/Visualizations/CommentsChartComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface CommentsChartProps {
  brandsData: {
    brandName: string;
    models: {
      comments?: { userEmail: string }[]; // Optional
    }[];
  }[];
}

const CommentsChartComponent: React.FC<CommentsChartProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    const commentsCount = brandsData.map(brand =>
      brand.models.reduce((count, model) => count + (model.comments?.length || 0), 0) // Safe access
    );

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: brandsData.map(brand => brand.brandName),
        datasets: [{
          label: 'Total Comments',
          data: commentsCount,
          backgroundColor: '#FF6384',
        }],
      },
      options: {
        scales: {
          y: {
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

export default CommentsChartComponent;
