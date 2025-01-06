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

// Define a color mapping for color names
const colorNameMapping: { [key: string]: string } = {
  Black: '#000000',
  White: '#FBFCFB',
  Red: '#FF0000',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Pink: '#FFC0CB',
  Green: '#008000',
  Aura: '#D6A9F2', // Example color for Aura
  Teal: '#008080',
  Gray: '#808080',
  Brown: '#A52A2A',
  Ivory: '#FFFFF0',
  Silver: '#C0C0C0',
  Unknown: '#808080', // Gray for unknown colors
};

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

    const labels = Object.keys(colorCount);
    const data = Object.values(colorCount);
    
    // Map the colors based on the color name
    const colors = labels.map(color => colorNameMapping[color] || colorNameMapping['Unknown']);

    // Create a pie chart instead of radar
    const myChart = new Chart(ctx, {
      type: 'pie', // Change to 'pie' for pie chart
      data: {
        labels,
        datasets: [{
          label: 'Color Distribution',
          data,
          backgroundColor: colors, // Use the mapped colors
          borderColor: '#000000', // Set border color to black
          borderWidth: 1, // Set border width (you can adjust this value)
        }],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.label || '';
                const value = tooltipItem.raw || 0;
                // Show color name in tooltip with count
                return `${label}: ${value}`;
              },
            },
          },
          legend: {
            display: false, // Disable the legend
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

export default ColorsDistributionComponent;





// // components/Visualizations/ColorsDistributionComponent.tsx
// import React, { useEffect, useRef } from 'react';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

// interface ColorsDistributionProps {
//   brandsData: {
//     models: {
//       colors?: string[]; // Optional
//     }[]; 
//   }[];
// }

// // Define a color mapping for color names
// const colorNameMapping: { [key: string]: string } = {
//   Black: '#000000',
//   White: '#FBFCFB',
//   Red: '#FF0000',
//   Blue: '#0000FF',
//   Yellow: '#FFFF00',
//   Pink: '#FFC0CB',
//   Green: '#008000',
//   Aura: '#D6A9F2', // Example color for Aura
//   Teal: '#008080',
//   Gray: '#808080',
//   Brown: '#A52A2A',
//   Ivory: '#FFFFF0',
//   Silver: '#C0C0C0',
//   Unknown: '#808080', // Gray for unknown colors
// };

// const ColorsDistributionComponent: React.FC<ColorsDistributionProps> = ({ brandsData }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return; // Ensure ctx is valid

//     // Count occurrences of each color
//     const colorCount: { [key: string]: number } = {};

//     brandsData.forEach(brand => {
//       brand.models.forEach(model => {
//         model.colors?.forEach(color => {
//           colorCount[color] = (colorCount[color] || 0) + 1;
//         });
//       });
//     });

//     const labels = Object.keys(colorCount);
//     const data = Object.values(colorCount);
    
//     // Map the colors based on the color name
//     const colors = labels.map(color => colorNameMapping[color] || colorNameMapping['Unknown']);

//     // Create a pie chart instead of radar
//     const myChart = new Chart(ctx, {
//       type: 'pie', // Change to 'pie' for pie chart
//       data: {
//         labels,
//         datasets: [{
//           label: 'Color Distribution',
//           data,
//           backgroundColor: colors, // Use the mapped colors
//           borderColor: '#000000', // Set border color to black
//           borderWidth: 1, // Set border width (you can adjust this value)
//         }],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'right', // Position the legend at the top
//           },
//           tooltip: {
//             callbacks: {
//               label: (tooltipItem) => {
//                 const label = tooltipItem.label || '';
//                 const value = tooltipItem.raw || 0;
//                 return `${label}: ${value}`;
//               },
//             },
//           },
//         },
//       },
//     });

//     return () => {
//       myChart.destroy();
//     };
//   }, [brandsData]);

//   return <canvas ref={canvasRef} className='w-full mx-auto'/>;
// };

// export default ColorsDistributionComponent;
