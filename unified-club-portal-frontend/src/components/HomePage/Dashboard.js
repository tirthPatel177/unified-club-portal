import React from 'react'
import { Redirect } from 'react-router-dom';

export const Dashboard = () => {

    const logout = () => {
        localStorage.removeItem("token");
    };

    return (
        <div>
            {
                !localStorage.getItem('token') ? (<Redirect to='/login' />) : null
            }
            <p>
                This is protected route.
            </p>
            <button onClick={logout}>
                Logout
            </button>
        </div>
    )
}
