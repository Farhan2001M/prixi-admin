import * as React from 'react';
import { useEffect, useState } from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {Button, Spinner } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { FaCar } from 'react-icons/fa'; // Importing the car icon as well
interface ModelData {
  modelName?: string;
  vehicleType?: string;
  engineType?: string;
  description?: string;
  torque?: number;
  launchPrice?: number;
  horsepower?: number;
  seatingCapacity?: number;
  variants?: string[];
  colors?: string[];
  images?: string[]; // Base64 encoded images
  comments?: string[]; // Base64 encoded images
};

interface CarBrand {
  brandName: string;
  models: ModelData[];
}

interface BrandTableProps {
  refresh: boolean;
}

export const BrandTable: React.FC<BrandTableProps> = ({ refresh }) => {
  
  const [brandsData, setBrandsData] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ;

  // Fetch the brands and models from the FastAPI backend
  const fetchBrandsModels = async () => {
    try {
      console.log("API Base URL:", apiBaseUrl);
      const response = await fetch(`${apiBaseUrl}/vehicles`);
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
  }, [refresh]);

  
  if (loading) return ( 
    <div className="flex flex-col items-center justify-center space-x-4 mt-32">
      {/* Three spinners centered with the message */}
      <div className="flex mb-4">
        <Spinner size="lg" />
        <Spinner size="lg" />
        <Spinner size="lg" />
      </div>
      <div className="text-3xl flex items-center ml-4">
        <FaCar className="mr-2" /> {/* Car icon */}
        <span>Fetching Brands Data </span>
        <FaCar className="ml-2" /> {/* Car icon */}
      </div>
    </div>
  )

  return (
    <div>
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>BrandNames</TableColumn>
          <TableColumn className='text-center' >Models</TableColumn>
          <TableColumn className='text-center' >Navigation Links</TableColumn>
        </TableHeader>
        <TableBody>
          {brandsData.map((brand, brandIndex) => (
            <TableRow key={brandIndex}>
              <TableCell>{brand.brandName}</TableCell>
              <TableCell className='text-center' >{brand.models ? brand.models.length : 0}</TableCell> 
              <TableCell className='flex justify-center'>
                <Button
                  href={`/addupdatevehicles/${brand.brandName}`} 
                  as={Link}
                  color="primary"
                  variant="solid"
                  className='min-w-[250px]'
                >
                  See details for {brand.brandName.toLocaleUpperCase()}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );  
}

