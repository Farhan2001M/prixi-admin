import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Model {
    modelName: string;
    modelYear?: number; // Optional property; add more if necessary
}

interface Brand {
    brandName: string;
    models: Model[];
}

interface ChartComponentProps {
    brandsData: Brand[];
}

const ModelCountChartComponent: React.FC<ChartComponentProps> = ({ brandsData }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Define an array of unique colors
    const colors = [
        '#36A2EB', // Blue
        '#FF6384', // Red
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40', // Orange
        '#FF6384', // Red
        '#4BC0C0', // Teal
        '#36A2EB', // Blue
        '#9966FF', // Purple
        '#FFCE56', // Yellow
        '#FF9F40', // Orange
    ];

    useEffect(() => {
        if (!canvasRef.current) return;

        console.log(brandsData);

        const ctx = canvasRef.current.getContext('2d');

        if (ctx) {
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: brandsData.map(brand => brand.brandName),
                    datasets: [{
                        label: 'Number of Models',
                        data: brandsData.map(brand => brand.models.length),
                        backgroundColor: brandsData.map((_, index) => colors[index % colors.length]),
                        borderColor: brandsData.map((_, index) => colors[index % colors.length]),
                        borderWidth: 1,
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
        }
    }, [brandsData]);

    return <canvas ref={canvasRef} />;
};

export default ModelCountChartComponent;

