'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FinalTable from './FinalTable'
import Header from '../../components/header';
import {Button, Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { FaArrowLeft , FaCar} from 'react-icons/fa'; // Importing the back arrow icon

const YourComponent = () => {
  const params = useParams();
  const brandName = Array.isArray(params.brand) ? params.brand[0] : params.brand;
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true); // state to track loading
  const router = useRouter();

  const handleClick = () => {
    router.push('/addupdatevehicles'); // Navigates to the specified route
  };

  const fetchBrandData = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
    try {
      const response = await fetch(`${BASE_URL}/getBrandData/${encodeURIComponent(brandName)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setBrandData(data);
      setLoading(false); // Data is loaded, hide loading spinner
      console.log("Brand Data:", data);
    } catch (error) {
      setLoading(false); // Hide the spinner in case of error
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
      <Header/>
      <div className="p-8 flex justify-between mt-12">
        <h1 className="text-3xl">Managing Vehicles for: {brandName || "Unknown Brand"}</h1>
        <Button color="primary" onClick={handleClick} startContent={<FaArrowLeft />}>
          Go Back
        </Button>
      </div>
      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-x-4">
            {/* Three spinners centered with the message */}
            <div className="flex mb-4">
              <Spinner size="lg" />
              <Spinner size="lg" />
              <Spinner size="lg" />
            </div>
            <div className="text-3xl flex items-center ml-4">
              <FaCar className="mr-2" /> {/* Car icon */}
              <span>Fetching Cars Data </span>
              <FaCar className="ml-2" /> {/* Car icon */}
            </div>
          </div>
        ) : (
          <FinalTable brandData={brandData} refreshModels={fetchBrandData} />
        )}
      </div>
    </div>
  );
};

export default YourComponent;


