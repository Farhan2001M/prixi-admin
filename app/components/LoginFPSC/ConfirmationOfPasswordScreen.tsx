"use client"
import React, { useEffect, useRef } from 'react';
// import JitterText from '@/components/animata/text/jitter-text-'


interface ConfirmationOfPasswordScreenProps {
  visible: boolean;
  onClick: () => void;
}

const ConfirmationOfPasswordScreen: React.FC<ConfirmationOfPasswordScreenProps> = ({ visible , onClick }) => {
  
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
      const intervalDuration = 4000; // 4 seconds

      const intervalId = setInterval(() => {
          if (buttonRef.current) {
              // Add the vibrate animation
              buttonRef.current.classList.add('animate-vibrate');

              // Remove the vibrate animation class after the animation ends
              setTimeout(() => {
                  buttonRef.current?.classList.remove('animate-vibrate');
              }, 500); // 500ms is the duration of the vibration animation
          }
      }, intervalDuration);
      
      // Cleanup interval on component unmount
      return () => {
          clearInterval(intervalId);
      };
  }, []);
  

  return (
    <div>

      <div className={`fixed top-1/2 left-1/2 w-1/2 h-1/4 bg-slate-200 shadow-lg rounded-2xl z-20 transform transition-transform duration-[1000ms] ease-in-out flex items-center justify-center `} style={{ transform: visible ? 'translateX(-50%) translateY(-50%)' : 'translateX(-50%) translateY(-350%)' }} >
        
        <div className=' flex flex-col justify-around items-center w-[95%] h-[85%]  bg-white'>
          <div>
            <h2 className="text-3xl font-bold text-center my-4">Password Changed Successfully</h2>
            <p className=" text-center">You’ve successfully reset your password. Please log in with your new password.</p>
          </div>

          <div className='flex flex-col justify-center  w-[95%] h-[95%] '>
            <button
              type="button"
              onClick={() => { window.location.reload(); }}
              ref={buttonRef}
              className="text-lg p-2 rounded w-full mx-auto bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue To Login
            </button>
          </div>
        </div>

      </div>

      <div className={`fixed top-0 left-0 w-screen h-full bg-black bg-opacity-70 z-10 transition-opacity duration-300 ease-in-out flex items-center justify-center`} style={{  opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}  > </div>
      
    </div>
  );
};

export default ConfirmationOfPasswordScreen;
