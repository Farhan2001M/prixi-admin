import React, { useState, useRef, useImperativeHandle, forwardRef, KeyboardEvent, ChangeEvent } from 'react';

interface OtpInputProps {
  onOtpChange: (otp: string) => void;
  onOtpComplete: (isComplete: boolean) => void;
}

// Use `forwardRef` to pass a ref to the `OtpInput` component
const OtpInput = forwardRef(({ onOtpChange, onOtpComplete }: OtpInputProps, ref) => {
  const numberOfDigits = 6; // Number of OTP boxes
  const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>(new Array(numberOfDigits).fill(null));

  // Handle changes in input fields
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1]?.focus();
      }

      onOtpChange(newOtp.join(""));

      const isComplete = newOtp.every(digit => digit !== "");
      onOtpComplete(isComplete);
    }
  };

  // Expose the `clearOtp` method via the `ref`
  useImperativeHandle(ref, () => ({
    clearOtp: () => {
      const clearedOtp = new Array(numberOfDigits).fill("");
      setOtp(clearedOtp);
      onOtpChange(""); // Notify parent that OTP is cleared
      onOtpComplete(false); // Notify parent that OTP is no longer complete
      otpBoxReference.current[0]?.focus(); // Optionally focus on the first box
    }
  }));

  // Handle key events for navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpBoxReference.current[index - 1]?.focus();
    } else if (e.key === "Enter" && otp[index] !== "" && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center my-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          ref={(el) => { otpBoxReference.current[index] = el }}
          className="border w-12 h-12 text-center text-2xl rounded-md"
        />
      ))}
    </div>
  );
});


// Set the display name for the component
OtpInput.displayName = 'OtpInput';

export default OtpInput;
































// import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

// // Define the type for the props
// interface OtpInputProps {
//   onOtpChange: (otp: string) => void;
//   onOtpComplete: (isComplete: boolean) => void;
// }

// const OtpInput: React.FC<OtpInputProps> = ({ onOtpChange, onOtpComplete }) => {
//   const numberOfDigits = 6; // Number of OTP boxes
//   const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
//   const otpBoxReference = useRef<(HTMLInputElement | null)[]>(new Array(numberOfDigits).fill(null));

//   // Handle changes in input fields
//   const handleChange = (value: string, index: number) => {
//     if (/^[0-9]$/.test(value) || value === "") {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < numberOfDigits - 1) {
//         otpBoxReference.current[index + 1]?.focus();
//       }

//       // Call the callback to notify the parent of OTP change
//       onOtpChange(newOtp.join(""));

//       // Check if OTP is complete
//       const isComplete = newOtp.every(digit => digit !== "");
//       onOtpComplete(isComplete);
//     }
//   };

//   // Handle key events for navigation
//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       otpBoxReference.current[index - 1]?.focus();
//     } else if (e.key === "Enter" && otp[index] !== "" && index < numberOfDigits - 1) {
//       otpBoxReference.current[index + 1]?.focus();
//     }
//   };

//   return (
//     <div className="flex gap-4 justify-center my-3">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           type="text"
//           value={digit}
//           maxLength={1}
//           onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
//           onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
//           ref={(el) => { otpBoxReference.current[index] = el}}
//           className="border w-12 h-12 text-center text-2xl rounded-md"
//         />
//       ))}
//     </div>
//   );
// };

// export default OtpInput;











































// import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

// // Define the type for the props
// interface OtpInputProps {
//   onOtpChange: (otp: string) => void;
//   onOtpComplete: (isComplete: boolean) => void;
// }

// const OtpInput: React.FC<OtpInputProps> = ({ onOtpChange, onOtpComplete }) => {
//   const numberOfDigits = 6; // Number of OTP boxes
//   const [otp, setOtp] = useState<string[]>(new Array(numberOfDigits).fill(""));
//   const otpBoxReference = useRef<(HTMLInputElement | null)[]>([]);

//   // Handle changes in input fields
//   const handleChange = (value: string, index: number) => {
//     if (/^[0-9]$/.test(value) || value === "") {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < numberOfDigits - 1) {
//         otpBoxReference.current[index + 1]?.focus();
//       }

//       // Call the callback to notify the parent of OTP change
//       onOtpChange(newOtp.join(""));

//       // Check if OTP is complete
//       const isComplete = newOtp.every(digit => digit !== "");
//       onOtpComplete(isComplete);
//     }
//   };

//   // Handle key events for navigation
//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       otpBoxReference.current[index - 1]?.focus();
//     } else if (e.key === "Enter" && otp[index] !== "" && index < numberOfDigits - 1) {
//       otpBoxReference.current[index + 1]?.focus();
//     }
//   };

//   return (
//     <div className="flex gap-4 justify-center my-3">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           type="text"
//           value={digit}
//           maxLength={1}
//           onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
//           onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
//           ref={(el) => (otpBoxReference.current[index] = el)}
//           className="border w-12 h-12 text-center text-2xl rounded-md"
//         />
//       ))}
//     </div>
//   );
// };

// export default OtpInput;
