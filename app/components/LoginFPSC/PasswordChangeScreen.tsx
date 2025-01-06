"use client"

import React, { useEffect } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
// import ConfettiButton, { ConfettiButtonHandle } from '../ConfettiButton';

import ConfirmationOfPasswordScreen from './ConfirmationOfPasswordScreen';


interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
}

interface PasswordChangeScreenProps {
  visible: boolean;
  onClick: () => void;
  email: string
}

const PasswordChangeScreen: React.FC<PasswordChangeScreenProps> = ({ visible , onClick, email  }) => {

  // Reset Your Password Popup Screen
  const [RSTpassword, setRSTpassword] = useState('');
  const [RSTconfirmPassword, setRSTconfirmPassword] = useState('');
  const [RSTisPasswordVisible, setRSTisPasswordVisible] = useState(false);
  const [RSTisConfirmPasswordVisible, setRSTisConfirmPasswordVisible] = useState(false);
  // const [RSTerrors, setRSTerrors] = useState<any>({});
  const [RSTerrors, setRSTerrors] = useState<ValidationErrors>({});
  const [PasswordChangeError, setPasswordChangeError] = useState('');
  const [myemail, setEmail] = useState('');

  useEffect(() => {
    if (email) {
      setEmail(email);
    }
  }, [email]);

  const RSTvalidateFields = (name: string, value: string) => {
    const RSTnewErrors: ValidationErrors = {};

    if (name === 'password') {
      if (value.length < 1) {
        RSTnewErrors.password = '';
      } else if (/\s/.test(value)) {
        RSTnewErrors.password = 'Password cannot contain spaces.';
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,40}/.test(value)) {
        RSTnewErrors.password = 'Password must contain 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
      } else if(value.length > 7){
        RSTnewErrors.password = '';
        if (value !== RSTconfirmPassword) {
          RSTnewErrors.confirmPassword = 'Passwords do not match.';
        }else{
          RSTnewErrors.confirmPassword = '';
        }
      }
    }
    if (name === 'confirmPassword') {
      if(value.length < 1){
        RSTnewErrors.confirmPassword = '';
      } else if (value !== RSTpassword) {
        RSTnewErrors.confirmPassword = 'Passwords do not match.';
      } else {
        RSTnewErrors.confirmPassword = '';
      }
    }
    setRSTerrors((prevErrors) => ({ ...prevErrors, ...RSTnewErrors }));
  };
  const RSThandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') setRSTpassword(value);
    if (name === 'confirmPassword') setRSTconfirmPassword(value);
    RSTvalidateFields(name, value);
  };

  
  const isButtonDisabled = (): boolean => {
    return ( !!RSTerrors.password || !!RSTerrors.confirmPassword || !RSTpassword || !RSTconfirmPassword );
  };
 
  const [showConfirmationOfPasswordScreen, setShowConfirmationOfPasswordScreen] = useState<boolean>(false);
  
  async function changeUserPassword() {
    const passwordData = {
      email: myemail, // The email of the user whose password is being changed
      new_password: RSTpassword, // Ensure this variable is set based on the new password input field
    };
  
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/admin-change-password`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Password change successful:', data);
        toggleSuccessConfirmationScreen(); // Show success confirmation
      } else {
        console.error('Password change failed: Try again later', data.message);
        // Display error message if needed
        setPasswordChangeError('Password change failed:');
        return { general: data.message }; 
      }
  
    } catch (error) {
      console.error('An error occurred:', error);
      setPasswordChangeError('An error occurred:');
      // Handle network errors or other unexpected issues
    }
  }


  const toggleSuccessConfirmationScreen = () => {

    onClick();
    setTimeout(() => { 
      setShowConfirmationOfPasswordScreen(!showConfirmationOfPasswordScreen);
    }, 100);

  };

  const handleChangePasswordClick = () => {
    changeUserPassword();
  };

  return (
    <div>

      <div className={`fixed top-1/2 left-1/2 w-1/2 h-1/2 bg-slate-200 shadow-lg rounded-2xl z-20 transform transition-transform duration-[1000ms] ease-in-out flex items-center justify-center `} style={{ transform: visible ? 'translateX(-50%) translateY(-50%)' : 'translateX(-50%) translateY(-350%)' }} >
        <div className='relative flex flex-col justify-around items-center w-[95%] h-[90%]  bg-white'>
          <RxCrossCircled onClick={ ()=> {
            setRSTpassword('');
            setRSTconfirmPassword('');
            setRSTerrors({});
            onClick(); }} 
            className='absolute top-1 right-1 text-black hover:text-red-500 cursor-pointer' size={40}  />

          <div>
            <h2 className="text-3xl font-bold text-center mb-2">Reset your password</h2>
            <p className=" text-center">Create a strong password for your Prixi account</p>
          </div>

          <div className='flex justify-center items-center w-[95%] border-2 border-black rounded-2xl h-auto py-2 '>
            <div className='flex flex-col justify-center  w-[95%] h-[95%] '>

              <div className="mb-4 ">
                <label htmlFor="password" className="block text-black text-base font-bold">Password <span className='text-red-500'>*</span></label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={RSTisPasswordVisible ? 'text' : 'password'}
                    value={RSTpassword}
                    maxLength={40}
                    onChange={RSThandleInputChange}
                    className="block w-full shadow-sm mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Enter Your Password"
                  />
                  <button
                    type="button"
                    onClick={() => setRSTisPasswordVisible(!RSTisPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                  >
                    {RSTisPasswordVisible ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
                {RSTerrors.password && <p className="text-red-500 text-sm mt-1">{RSTerrors.password}</p>}
              </div>

              <div className="mb-4 ">
                <label htmlFor="confirmPassword" className="block text-black text-base font-bold">Confirm Password <span className='text-red-500'>*</span></label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={RSTisConfirmPasswordVisible ? 'text' : 'password'}
                    value={RSTconfirmPassword}
                    maxLength={40}
                    onChange={RSThandleInputChange}
                    className="block w-full shadow-sm mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Confirm Your Password"
                  />
                  <button
                    type="button"
                    onClick={() => setRSTisConfirmPasswordVisible(!RSTisConfirmPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                  >
                    {RSTisConfirmPasswordVisible ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
                {RSTerrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{RSTerrors.confirmPassword}</p>}
              </div>

              {PasswordChangeError && (
                <span className="block text-center text-red-700 text-base font-semibold">
                  {PasswordChangeError}
                </span>
              )}
              
              <button
                type="button"
                disabled={isButtonDisabled()}
                onClick={ () => { 
                  setRSTpassword('');
                  setRSTconfirmPassword('');
                  handleChangePasswordClick(); } }
                className={`text-lg p-2 rounded w-full mx-auto ${isButtonDisabled() ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Confirm Reset Password
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-screen h-full bg-black bg-opacity-70 z-10 transition-opacity duration-1000 ease-in-out flex items-center justify-center`} style={{  opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }} onClick={ ()=>{
        setRSTpassword('');
        setRSTconfirmPassword('');
        onClick();
        setRSTerrors({});
      } } > </div>
      
      <ConfirmationOfPasswordScreen visible={showConfirmationOfPasswordScreen} onClick={() => setShowConfirmationOfPasswordScreen(false)} />
    </div>
  );
};

export default PasswordChangeScreen;

