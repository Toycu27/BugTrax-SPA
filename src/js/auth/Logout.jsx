import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';

export default function Logout() {
    const { deleteUser } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.deleteRequest('sanctum/token', () => {
            deleteUser();
            navigate('/');
        }, () => {
            deleteUser();
            navigate('/');
        });
    }, []);

    return (
        <div className="container">
            <h1>Logging Out...</h1>
        </div>
    );
}
