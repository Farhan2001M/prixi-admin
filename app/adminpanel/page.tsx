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

interface CarBrand {
  brandName: string;
  models: any[];
}

const UserInterface = () => {

  const [brandsData, setBrandsData] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the brands and models from the FastAPI backend
  const fetchBrandsModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/vehicles');
      const data = await response.json();

      setBrandsData(data);
      setLoading(false);
    
    } catch (error) {
      console.error('Error fetching brands and models:', error);
      setLoading(false);
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
