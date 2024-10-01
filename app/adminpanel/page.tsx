'use client';

import Header from '../components/header'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated import for the new App Router
import { isTokenValid } from '../utils/auth'; // Adjust the path as needed

const UserInterface = () => {

    const router = useRouter();

    useEffect(() => {
        // Function to check token validity
        const checkTokenValidity = () => {
            if (!isTokenValid()) {
                // Clear the token from localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                router.push('/login?expired=true');
            }
        };
        // Check immediately on mount
        checkTokenValidity();
        // Set an interval to check every minute
        const intervalId = setInterval(checkTokenValidity, 2 * 60 * 1000); // Check every 2 minutes
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [router]);

    return (
        <div className="flex flex-col">
            <Header/>
        </div>  
    );
};

export default UserInterface;
