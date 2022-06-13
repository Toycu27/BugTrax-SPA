import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { GlobalContext } from '../Auth';
import axios from "axios";

export default function Logout() {
    const { deleteUser } = useContext(GlobalContext);
    let navigate = useNavigate();

    useEffect(() => {
        axios.deleteRequest('sanctum/token', (e) => {
            deleteUser();
            navigate('/');
        });
    }, []);

    return (<div className="container">
        <h1>Logging Out...</h1>
    </div>);
}