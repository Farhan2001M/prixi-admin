"use client"

import React, { useState, FormEvent , useEffect } from 'react';
import Link from 'next/link';
import { IoEye, IoEyeOff } from 'react-icons/io5';
// import { useRouter } from 'next/navigation';
import { GrLogin } from "react-icons/gr";
import ForgotPassScreen from '../components/LoginFPSC/ForgotPassScreen';
import { setCookie } from 'nookies'; // A Next.js-friendly library for handling cookies

import { useRouter, useSearchParams } from 'next/navigation';

const Myloginpage = () => {

  

  const searchParams = useSearchParams();
  const expired = searchParams.get('expired');

  useEffect(() => {
      if (expired) {
          alert('Your session has expired. Please log in again.');
      }
  }, [expired]);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [FPScreen, setFPScreen] = useState<boolean>(false);
 
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleToggle = () => {
    setFPScreen(!FPScreen);
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required.';
    } else if (/\s/.test(email)) {
      return 'Email cannot contain spaces.';
    } else if (email.length < 3 ) {
      return 'Email should be between 3 and 40 characters.';
    } else if (!/@/.test(email)) {
      return 'Email must include @.';
    } else if (!/\.[a-zA-Z]{1,}/.test(email.split('@')[1] || '')) {
      return 'Email must include a valid domain (e.g, .com / .in / .net)';
    } else {
      return '';
    }
  };

  const validatePassword = (password: string): string => {
    if(!password){
      return 'Password is required.';
    } else if (/\s/.test(password)) {
      return 'Password cannot contain spaces.';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,40}/.test(password)) {
      return 'Password must contain 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
    } else if (password.length > 7) {
      return '';
    } else{
      return '';
    }
  }

  const handleLogin = async(event: FormEvent) => {
    event.preventDefault();
  
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
    } else {
      setEmailError('');
    }
  
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
    } else {
      setPasswordError('');
    }

    if (!emailValidationError && !passwordValidationError) {

      try {
        // Construct the query string with email and password
        const query = new URLSearchParams({ email, password }).toString();
    
        // Send the request with query parameters
        const response = await fetch(`http://localhost:8000/adminlogin?${query}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });
    
        // Check if the response was not OK (error cases)
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400) {
                setEmailError('Email is not registered with us.');
            } else if (response.status === 401) {
                setPasswordError('Invalid password.');
            } else {
                console.error('Unexpected error:', errorData.detail);
            }
            return;
        }
    
        // If login is successful
        const data: any = await response.json();
        
        if(response.ok){
          const token = data.token;
          const expiryTime = Date.now() + (50 * 60 * 1000); // Token valid for 50 minute
          // Store token and expiry time
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          router.push('/adminpanel'); // Redirect to another page

        } else {
          console.error('Unexpected response:', data);
        }
      } catch (error) {
          console.error('An error occurred:', error);
          // Handle network errors or other unexpected issues
      }
    }
  };

  return (
    <div className="m-0">
      {/* Navbar Screen */}
      <nav className='bg-black h-[10vh]'>
        <div className='w-[95%] h-full mx-auto text-white flex justify-between'>
          <Link href="/" className='my-auto'><img className="w-[150px] " src="/images/PWlogo.png" alt="" /></Link>
        </div>
      </nav>

      <div className="w-full h-[88vh] flex items-center justify-center my-auto">
        <div className="w-[95%] h-[95%] flex">
          {/* Login Screen */}
          <div className="w-1/2 p-8 flex flex-col gap-12 my-auto mx-auto">
            <img className="h-[50px] mx-auto" src="/images/PBlogo.png" alt="" />

            <form className='w-5/6 mx-auto' onSubmit={handleLogin} noValidate>
              <h1 className="text-3xl font-bold my-6 text-center">Login</h1>

              <div className="mb-4">
                <label htmlFor="email" className="block text-black text-xl font-bold">
                  Email ID <span className='text-red-500'>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                  placeholder="Email ID"
                  maxLength={40}
                />
                {emailError && (
                  <span className="block text-red-700 text-sm font-semibold">
                    {emailError}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-black text-xl font-bold">
                  Password <span className='text-red-500'>*</span>
                </label>

                <div className="relative">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded w-full"
                    placeholder="Enter Password"
                    maxLength={40}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-2 pt-2 text-gray-500"
                  >
                    {isPasswordVisible ? <IoEyeOff className="text-xl" /> : <IoEye className="text-xl" />}
                  </button>
                </div>
                {passwordError && (
                  <span className="block text-red-700 text-sm font-semibold">
                    {passwordError}
                  </span>
                )}
              </div>

              <div className="flex justify-end items-center mb-4">
                <div>
                  <a
                    href="#"
                    className=" text-lg text-blue-600 hover:underline"
                    onClick={(e) => { e.preventDefault(); handleToggle(); }}
                  >
                    Forgot Password?
                  </a>
                  <ForgotPassScreen show={FPScreen} onClick={handleToggle} />
                </div>
              </div>

              <div className='flex mx-auto'>
                <button
                  type="submit"
                  className="flex justify-center items-center gap-2 bg-blue-600 text-lg text-white p-2 rounded w-full mx-auto hover:bg-blue-700"
                >
                  <GrLogin className="text-2xl" /> Login
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Myloginpage;

