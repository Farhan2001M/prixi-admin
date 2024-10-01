'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '../utils/auth'; // Adjust the path as needed

const TokenValidator = () => {
    const router = useRouter();

    useEffect(() => {
        const checkTokenValidity = () => {
            if (!isTokenValid()) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                router.push('/login?expired=true');
            }
        };

        checkTokenValidity();
        const intervalId = setInterval(checkTokenValidity, 1 * 60 * 1000); // Check every 2 minutes

        return () => clearInterval(intervalId);
    }, [router]);

    return null; // This component does not render anything
};

export default TokenValidator;
