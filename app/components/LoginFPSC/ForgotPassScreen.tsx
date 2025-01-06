import React, { useState, useEffect } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import OTPScreen from './OTPScreen';

interface ForgotPassScreenProps {
  show: boolean;
  onClick: () => void;
}

interface SuccessResponse {
  message: string;
}

const ForgotPassScreen: React.FC<ForgotPassScreenProps> = ({ show, onClick }) => {

  



  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  
  const [Femail, setFEmail] = useState<string>('');
  
  const [showOTPScreen, setShowOTPScreen] = useState<boolean>(false);

  const [EmailError, setEmailError] = useState('');

  // useEffect(() => {
  //   setFEmail('');
  // }, [show]);


  useEffect(() => {
    setIsValidEmail(validateEmail(Femail));
  }, [Femail]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  

  // Function to request OTP

  const handleRequestOTP = async () => {
    setIsValidEmail(false);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
      const response = await fetch(`${BASE_URL}/admin-forgot-password`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: Femail }),  // Send email as JSON body
      });

      if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400) {
              setEmailError('Email is not registered with us.');
          } else {
              console.error('Unexpected error:', errorData);
              setEmailError('Something went wrong. Please try again later.');
          }
          return;
      }

      const data: SuccessResponse = await response.json();

      console.log(data)
      console.log(data.message)

      // If OTP is successfully sent, show OTP input screen
      setShowOTPScreen(true);
      onClick();
      setEmailError(''); // Clear any previous error

    } catch (error) {
        console.error('An error occurred:', error);
        setEmailError('Network error. Please try again later.');
    }
          
  };
  

  const handleOverlayClick = () => {
    onClick();
    setTimeout(() => { 
      setFEmail('');
      setEmailError('');
    }, 1000);
  };

  const handleCrossClick = () => {
    onClick();
    setTimeout(() => { 
      setFEmail('');
      setEmailError('');
    }, 1000);
  };

  return (
    <div>
      {/* Forgot Password Modal */}
      <div className={`fixed top-1/2 left-1/2 w-1/2 h-1/2 bg-slate-200 shadow-lg rounded-2xl z-20 transform transition-transform duration-700 ease-in-out flex items-center justify-center`} style={{ transform: show ? 'translateX(-50%) translateY(-50%)' : 'translateX(-250%) translateY(-50%)' }} >
        <div className='relative flex flex-col justify-around items-center w-[95%] h-[90%] bg-white'>
          <RxCrossCircled onClick={handleCrossClick} className='absolute top-1 right-1 text-black hover:text-red-500 cursor-pointer' size={40} />
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">Forgot your password?</h2>
            <p className="text-center">Enter your email to get an OTP</p>
          </div>

          <div className='flex justify-center items-center w-[95%] h-[47%] border-2 border-black rounded-2xl'>
            <div className='flex flex-col justify-center w-[95%] h-[95%]'>
              <label htmlFor="email" className="block text-black text-xl font-bold">
                Enter Your Registered Email ID <span className='text-red-500'>*</span>
              </label>
              <input type="email" id="email" value={Femail} onChange={(e) => setFEmail(e.target.value)} className="mt-2 p-2 border border-gray-300 rounded w-full" placeholder="Email ID"maxLength={60} />
              {EmailError && (
                <span className="block text-red-700 text-base font-semibold">
                  {EmailError}
                </span>
              )}
              <div>
                <button type="button" onClick={handleRequestOTP} disabled={!isValidEmail} className={`text-lg p-2 rounded w-full mx-auto mt-5 ${isValidEmail ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} >
                  Request OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className={`fixed top-0 left-0 w-screen h-full bg-black bg-opacity-70 z-10 transition-opacity duration-[1000ms] ease-in-out flex items-center justify-center`} style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }} onClick={handleOverlayClick} />

      {/* Always render OTPScreen and control visibility */}
      <OTPScreen visible={showOTPScreen} onClick={() => setShowOTPScreen(false)} Femail={Femail} />
    </div>
  );
};

export default ForgotPassScreen;
