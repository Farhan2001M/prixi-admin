import * as React from 'react';
import { useEffect, useState } from 'react';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {Button, ButtonGroup} from "@nextui-org/react";
// import Mybutton from '../MUI/Button'
import { Link } from "@nextui-org/react";

interface CarBrand {
  brandName: string;
  models: any[];
}

export default function BrandTable() {
  
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
                  href={`/addupdatevehicles/${brand.brandName}`} // Correctly using template literals
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

