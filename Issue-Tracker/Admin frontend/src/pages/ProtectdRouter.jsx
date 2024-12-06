import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ element, children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  
    const location = useLocation();

    const checkAuth = async () => {
        const accessToken = localStorage.getItem('accessToken');  
        
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const res = await axios.get('http://localhost:8000/api/v1/users/protected-route', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,  
                },
                withCredentials: true,
            });
            setIsAuthenticated(true);
            console.log(res.data);
        } catch (error) {
            setIsAuthenticated(false);
            console.error('Authorization error:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        console.log("Checking protected route");
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;  
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return element ? element : children;
}

export default ProtectedRoute;
