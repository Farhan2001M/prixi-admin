'use client';

import React from 'react';
import BrandTable from './BrandTable';
import Header from '../components/header';
import { useState } from 'react';
import {Button} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

const AddUpdateVehicles = () => {

  const [brandName, setBrandName] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Regex to allow only English letters (a-z, A-Z)
    const isValid = /^[a-zA-Z-]*$/.test(value);
    if (isValid) {
      setBrandName(value);
    }
    // Enable button if input has at least 2 characters
    setIsButtonEnabled(value.length >= 2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/addvehiclebrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // Success message
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
            <Input type="text" label="Enter Brand Name" value={brandName} required onChange={handleChange}/>
            
            <Button type="submit" size="lg" isDisabled={!isButtonEnabled} color="primary">
              Add Brand
            </Button>
          </div>
        </form>
        <div>
          <BrandTable />
        </div>
      </div>
    </div>
  );
};

export default AddUpdateVehicles;




// onChange={(e) => setModelName(capitalizeModelName(e.target.value))}
const capitalizeModelName = (name: string) => {
  return name
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
};
