'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FinalTable from './FinalTable'

const YourComponent = () => {
  const params = useParams();
  const brandName = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const [brandData, setBrandData] = useState(null);

  const fetchBrandData = async () => {
    try {
      const response = await fetch(`https://de05-2407-d000-1a-66a0-6050-2c36-62e5-9435.ngrok-free.app/getBrandData/${encodeURIComponent(brandName)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setBrandData(data);
      console.log("Brand Data:", data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };
  useEffect(() => {
    if (brandName) {
      fetchBrandData();
    }
  }, [brandName]);

  return (
    <div>
      <h1>Managing Vehicles for: {brandName || "Unknown Brand"}</h1>
      {brandData ?<FinalTable brandData={brandData} refreshModels={fetchBrandData} />: <> </> }
    </div>
  );
};

export default YourComponent;


