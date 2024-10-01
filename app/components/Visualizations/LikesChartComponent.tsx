// components/Visualizations/LikesChartComponent.tsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface LikesChartProps {
  brandsData: {
    brandName: string;
    models: {
      comments?: { Likes?: string[] }[]; // Optional
    }[];
  }[];
}

const LikesChartComponent: React.FC<LikesChartProps> = ({ brandsData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return; // Ensure ctx is valid

    const likesCount = brandsData.map(brand =>
      brand.models.reduce((count, model) => {
        return count + (model.comments?.reduce((likesCount, comment) => likesCount + (comment.Likes?.length || 0), 0) || 0);
      }, 0)
    );

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: brandsData.map(brand => brand.brandName),
        datasets: [{
          label: 'Total Likes',
          data: likesCount,
          backgroundColor: '#36A2EB', // A single color for all bars
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

export default LikesChartComponent;
