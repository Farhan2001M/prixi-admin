'use client';

import Header from '../components/header'
import TokenValidator from '../components/tokenvalidator'; 
import ChartComponent from '../components/Visualizations/ChartComponent';
import { useEffect, useState } from 'react';
import CommentsChartComponent from '../components/Visualizations/CommentsChartComponent';
import LikesChartComponent from '../components/Visualizations/LikesChartComponent';
import VehicleTypeDistributionComponent from '../components/Visualizations/VehicleTypeDistributionComponent';
import EngineTypeDistributionComponent from '../components/Visualizations/EngineTypeDistributionComponent';
import ColorsDistributionComponent from '../components/Visualizations/ColorsDistributionComponent';
// import SeatingCapacityDistributionComponent from '../components/Visualizations/SeatingCapacityDistributionComponent';

interface Comment {
  userEmail: string;
  Likes?: string[]; // Add Likes to the comment structure
}

interface ModelData {
  modelName: string;
  vehicleType?: string;
  engineType?: string;
  description?: string;
  torque?: number;
  launchPrice?: number;
  horsepower?: number;
  seatingCapacity?: number;
  variants?: string[];
  colors?: string[];
  images?: string[]; 
  comments?: Comment[]; 
};

interface CarBrand {
  brandName: string;
  models: ModelData[];
}

const Dashboard = () => {

  const [brandsData, setBrandsData] = useState<CarBrand[]>([]);

  // Fetch the brands and models from the FastAPI backend
  const fetchBrandsModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/vehicles');
      const data = await response.json();

      setBrandsData(data);
    
    } catch (error) {
      console.error('Error fetching brands and models:', error);
    }
  };

  useEffect(() => {
    fetchBrandsModels();
  }, []);

  return (
    <div className="flex flex-col">
      <TokenValidator /> 
      <Header/>

      {/* First row of charts */}
      <div className='flex flex-wrap w-full'>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[300px] mx-auto'>
          <VehicleTypeDistributionComponent brandsData={brandsData} />
        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[300px] mx-auto'>
          <EngineTypeDistributionComponent brandsData={brandsData} />
        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[300px] mx-auto'>
          <ColorsDistributionComponent brandsData={brandsData} />
        </div>
      </div>

      {/* Second row of charts */}
      <div className='flex flex-wrap w-full'>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[500px]'>
          <ChartComponent brandsData={brandsData} />
        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[500px]'>
          <CommentsChartComponent brandsData={brandsData} />
        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[500px]'>
          <LikesChartComponent brandsData={brandsData} />
        </div>
      </div>
    </div>  
  );
};

export default Dashboard;
