export const isTokenValid = (): boolean => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('tokenExpiry');

    if (!token || !expiryTime) {
        return false; // No token or expiry time found
    }

    return Date.now() < Number(expiryTime); // Check if current time is less than expiry time
};
