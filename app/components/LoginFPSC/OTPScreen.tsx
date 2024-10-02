import React, { useEffect, useState, useRef } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import OtpInput from './Otp';
import PasswordChangeScreen from './PasswordChangeScreen';


interface OTPScreenProps {
  visible: boolean;
  onClick: () => void;
  Femail: string;
}

interface OTPResponse {
  message: string;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ visible, onClick, Femail }) => {

  const [showPasswordChangeScreen, setShowPasswordChangeScreen] = useState<boolean>(false);
  const otpRef = useRef<{ clearOtp: () => void }>(null); // Create a ref for OtpInput
  const [OTPError, setOTPError] = useState('');

  const handleRequestOTP = async () => {
    setOTPError('');
    if (otpRef.current) {
      otpRef.current.clearOtp(); // Clear the OTP when requesting a new one
    }
    try {
      const response = await fetch('http://localhost:8000/admin-forgot-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: displayFemail }),  // Send email as JSON body
      });

      if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400) {
              setOTPError('');
          } else {
              console.error('Unexpected error:', errorData);
              setOTPError('Something went wrong. Please try again later.');
          }
          return;
      }

      const data: OTPResponse = await response.json(); // Use the defined interface

      console.log(data)
      console.log(data.message)

      // If OTP is successfully sent again, show this
      console.log(displayFemail)

    } catch (error) {
        console.error('An error occurred:', error);
        setOTPError('Network error. Please try again later.');
    }
          
  };


  const [otp, setOtp] = useState<string>("");
  const [isOtpComplete, setIsOtpComplete] = useState<boolean>(false);

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp);
  };

  const handleOtpComplete = (isComplete: boolean) => {
    setIsOtpComplete(isComplete);
  };


  const handleConfirmOtp = async () => {
    setIsOtpComplete(false);  // Reset OTP completion state
    setOTPError('');          // Clear any existing OTP errors

    console.log("Entered OTP:", otp);

    console.log(Femail);

    try {
        // Make a request to the FastAPI validate_otp endpoint
        const response = await fetch('http://localhost:8000/admin-validate-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: Femail,      // Ensure this is dynamically populated
                otp: otp.toString(),   // Ensure OTP is sent as a string
            }),
        });

        // Check if the request was successful
        if (response.ok) {
            const result = await response.json();
            
            // OTP validation successful
            console.log("OTP MATCHES");
            setShowPasswordChangeScreen(true);  // Proceed to next screen (password reset)
            onClick();                          // Handle any additional steps

            // Clear the OTP input if reference is available
            if (otpRef.current) {
                otpRef.current.clearOtp();      // Clear OTP field
            }

        } else {
            // OTP validation failed
            const error = await response.json();
            setOTPError(error.detail || 'Entered OTP is not correct.');  // Set OTP error message
            console.error("Error:", error.detail || "OTP validation failed.");
        }

    } catch (error) {
        // Handle network or other errors
        setOTPError('An error occurred while validating OTP.');
        console.error("An error occurred:", error);
    }
  };

  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const startTimer = () => {
    setIsTimerActive(true);
    setTimeLeft(60); // Set initial time (60 seconds)
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second
  };

  const formatTimeLeft = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        // handleRequestOTP();
        startTimer();
      }, 500);
    }
  }, [visible]);

  const [displayFemail, setDisplayFemail] = useState('');

  useEffect(() => {
    if (Femail) {
      setDisplayFemail(Femail);
    }
  }, [Femail]);

  return (
    <div>
      <div className={`fixed top-1/2 left-1/2 w-1/2 h-1/2 bg-slate-200 shadow-lg rounded-2xl z-20 transform transition-transform duration-[700ms] ease-in-out flex items-center justify-center`} style={{ transform: visible ? 'translateX(-50%) translateY(-50%)' : 'translateX(250%) translateY(-50%)' }}>
        <div className='relative flex flex-col justify-around items-center w-[95%] h-[90%] bg-white'>
          <RxCrossCircled onClick={() => {
            if (otpRef.current) {
              otpRef.current.clearOtp(); // Clear the OTP when closing the modal
            }
            onClick();
            setIsTimerActive(false);
          }} className='absolute top-1 right-1 text-black hover:text-red-500 cursor-pointer' size={40} />
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">OTP Verification</h2>
            <h1 className="text-xl text-center">Enter the OTP code sent to &quot;{displayFemail}&quot;</h1>
          </div>
          <div className='flex justify-center items-center w-[95%] h-[65%] border-2 border-black rounded-2xl'>
            <div className='flex flex-col justify-around w-[95%] h-[95%]'>
              <OtpInput ref={otpRef} onOtpChange={handleOtpChange} onOtpComplete={handleOtpComplete} />
              {OTPError && (
                <span className="block text-center text-red-700 text-base font-semibold">
                  {OTPError}
                </span>
              )}
              <div className='text-center'>
                <p className="text-lg">Didn&apos;t receive OTP Code</p>
                {isTimerActive && (
                  <p className="text-lg mt-3">
                    Resend Code available in: {formatTimeLeft(timeLeft)}
                  </p>
                )}
                <button
                  onClick={() => {
                    startTimer();
                    handleRequestOTP();  
                  }}
                  className={`text-base text-center ${isTimerActive ? 'text-gray-500 cursor-not-allowed' : 'text-blue-600 hover:text-blue-600 hover:underline'}`}
                  style={{ opacity: isTimerActive ? 0.5 : 1, background: 'none', border: 'none', padding: 0, cursor: isTimerActive ? 'not-allowed' : 'pointer', }}
                  disabled={isTimerActive}
                >
                  Resend Code
                </button>
              </div>
              <button type="button"
                onClick={handleConfirmOtp}
                className={`text-lg p-2 rounded w-full mx-auto my-3 ${isOtpComplete ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                disabled={!isOtpComplete}
              >
                Confirm OTP
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-screen h-full bg-black bg-opacity-70 z-10 transition-opacity duration-1000 ease-in-out flex items-center justify-center`} style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }} onClick= {()=>{
        if (otpRef.current) {
          otpRef.current.clearOtp(); // Clear the OTP when closing the modal
        }
        onClick();
        setIsTimerActive(false);
      }}  >
      </div>
      <PasswordChangeScreen visible={showPasswordChangeScreen} onClick={() => setShowPasswordChangeScreen(false)} email={displayFemail}   />
    </div>
  );
};

export default OTPScreen;

