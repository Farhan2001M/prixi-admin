'use client';

import React, { useState } from 'react';
import { BrandTable } from './BrandTable';
import Header from '../components/header';
import { Button, Input } from "@nextui-org/react";

const AddUpdateVehicles = () => {
  const [brandName, setBrandName] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false); // State to trigger table refresh

  const capitalizeBrandName = (name: string) => {
    return name
      .split('-') // Split by dash
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize first letter
      .join('-'); // Rejoin with dash
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Regex to allow only English letters (a-z, A-Z) and dashes
    const isValid = /^[a-zA-Z-]*$/.test(value);
    if (isValid) {
      const formattedValue = capitalizeBrandName(value);
      setBrandName(formattedValue);
    }
    // Enable button if input has at least 2 characters
    setIsButtonEnabled(value.length >= 2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${BASE_URL}/addvehiclebrand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // Success message
        setRefreshTable(prev => !prev); // Toggle refresh to trigger re-fetch in BrandTable
        setBrandName(''); // Clear input field after successful addition
        setIsButtonEnabled(false);
      } else {
        console.error(data.detail); // Error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <Header />
      <div className='w-10/12 mx-auto flex flex-col gap-8 mt-24'>
        <form className='w-3/5 mx-auto' onSubmit={handleSubmit}>
          <div className='flex gap-12 items-center'>
            <Input 
              type="text" 
              label="Enter Brand Name" 
              value={brandName} 
              required 
              onChange={handleChange} 
            />
            <Button type="submit" size="lg" isDisabled={!isButtonEnabled} color="primary">
              Add Brand
            </Button>
          </div>
        </form>
        <div className='w-3/4 mx-auto'>
          <BrandTable refresh={refreshTable} />
        </div>
      </div>
    </div>
  );
};

export default AddUpdateVehicles;


