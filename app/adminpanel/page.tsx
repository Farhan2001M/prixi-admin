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
import SeatingCapacityDistributionComponent from '../components/Visualizations/SeatingCapacityDistributionComponent';

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

const UserInterface = () => {

  const [brandsData, setBrandsData] = useState<CarBrand[]>([]);
  // const [loading, setLoading] = useState(true);

  // Fetch the brands and models from the FastAPI backend
  const fetchBrandsModels = async () => {
    try {
      const response = await fetch('https://de05-2407-d000-1a-66a0-6050-2c36-62e5-9435.ngrok-free.app/vehicles');
      const data = await response.json();

      setBrandsData(data);
      // setLoading(false);
    
    } catch (error) {
      console.error('Error fetching brands and models:', error);
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchBrandsModels();
  }, []);

  return (
    <div className="flex flex-col">
      <TokenValidator /> 
      <Header/>

      <div className='w-2/4 max-h-80 mx-auto'>
        <ChartComponent brandsData={brandsData} />
      </div>

      <div className='w-2/4  mx-auto'>
        <CommentsChartComponent brandsData={brandsData} />
        <LikesChartComponent brandsData={brandsData} />
        <VehicleTypeDistributionComponent brandsData={brandsData} />
        <EngineTypeDistributionComponent brandsData={brandsData} />
        <ColorsDistributionComponent brandsData={brandsData} />
        <SeatingCapacityDistributionComponent brandsData={brandsData} />
      </div>
    </div>  
  );
};

export default UserInterface;
