import * as React from 'react';
import { useEffect, useState } from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { Link } from "@nextui-org/react";

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

  // Fetch the brands and models from the FastAPI backend
  const fetchBrandsModels = async () => {
    try {
      const response = await fetch('https://de05-2407-d000-1a-66a0-6050-2c36-62e5-9435.ngrok-free.app/vehicles');
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

  
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>Models</TableColumn>
          <TableColumn>Info</TableColumn>
        </TableHeader>
        <TableBody>
          {brandsData.map((brand, brandIndex) => (
            <TableRow key={brandIndex}>
              <TableCell>{brand.brandName}</TableCell>
              <TableCell>{brand.models ? brand.models.length : 0}</TableCell> 
              <TableCell>
                <Button
                  href={`/addupdatevehicles/${brand.brandName}`} 
                  as={Link}
                  color="primary"
                  variant="solid"
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

