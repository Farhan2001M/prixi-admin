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
      const response = await fetch(`http://localhost:8000/getBrandData/${encodeURIComponent(brandName)}`);
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
      <h1 className="text-3xl mx-auto mt-5 mb-8 text-center">Managing Vehicles for: {brandName || "Unknown Brand"}</h1>
      {brandData ?<FinalTable brandData={brandData} refreshModels={fetchBrandData} />: <> </> }
    </div>
  );
};

export default YourComponent;


