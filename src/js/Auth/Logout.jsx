import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function Logout({ setUser, deleteUser }) {
    let navigate = useNavigate();

    useEffect(() => {
        axios.deleteRequest('sanctum/token', (e) => {
            deleteUser();
            navigate('/');
        });
    }, []);

    return (<h2>Logging Out...</h2>);
}