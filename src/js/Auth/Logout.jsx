import { useNavigate } from "react-router-dom";
import { useUser } from './';
import axios from "axios";

export default function Logout({ setUser }) {
    let navigate = useNavigate();
    const { user, deleteUser } = useUser();

    const handleLogout = async e => {
        e.preventDefault();
        const response = await axios.deleteRequest('sanctum/token');

        if (response.errors) {
            alert(response.message);
        } else {
            setUser(null);
            deleteUser();
            navigate('/');
        }
    }

    return <a className="dropdown-item" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Logout
    </a>;
}