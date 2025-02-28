'use client';

import Header from '../components/header'
import TokenValidator from '../components/tokenvalidator'; 
import ModelCountChartComponent from '../components/Visualizations/ModelCountChartComponent';
import { useEffect, useState } from 'react';
import CommentsChartComponent from '../components/Visualizations/CommentsChartComponent';
import LikesChartComponent from '../components/Visualizations/LikesChartComponent';
import VehicleTypeDistributionComponent from '../components/Visualizations/VehicleTypeDistributionComponent';
import EngineTypeDistributionComponent from '../components/Visualizations/EngineTypeDistributionComponent';
import ColorsDistributionComponent from '../components/Visualizations/ColorsDistributionComponent';

interface Comment {
  userEmail: string;
  Likes?: string[]; // Add Likes to the comment structure
}

interface ModelData {
  modelName: string;
  vehicleType?: string;
  engineType?: string;
  torque?: number;
  launchPrice?: number;
  horsepower?: number;
  seatingCapacity?: number;
  colors?: string[];
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
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    try {
      const response = await fetch(`${BASE_URL}/vehiclesDashboard`);
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
          <p className='text-center my-2'>Vehicle-Type Distribution Chart</p>

        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[300px] mx-auto'>
          <EngineTypeDistributionComponent brandsData={brandsData} />
          <p className='text-center my-2'>Engine-Type Distribution Chart</p>
        </div>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[300px] mx-auto'>
          <ColorsDistributionComponent brandsData={brandsData} />
          <p className='text-center my-2'>Color Distribution Chart</p>
          <p className='text-center text-sm text-gray-600'>Hover over the pie&apos;s to see more info such as vehicle count and their color Distribution</p>
        </div>
      </div>

      {/* Second row of charts */}
      <div className='flex flex-wrap w-full mt-20'>
        <div className='p-6 flex-1 md:w-1/3 sm:w-1/2 max-h-[500px]'>
          <ModelCountChartComponent brandsData={brandsData} />
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
