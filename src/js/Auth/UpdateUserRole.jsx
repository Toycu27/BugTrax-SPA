import { useState } from "react";
import { useUser } from '../Auth';
import { SelectField } from "../Form";
import axios from "axios";

export default function UpdateUserRole({item}) {
    const { hasRole, addMessage } = useUser();
    const [role, setRole] = useState(item.role);
    const roleOpts = ['Admin', 'Manager', 'Member', 'Client'];

    const handleChange = async e => {
        setRole(e.target.value);

        const response = await axios.patchRequest(
            'api/users/' + item.id, 
            { role: e.target.value }
        );

        if (response.errors) {
            addMessage(response.message, "danger");
        } else {
            addMessage(response.message);
        }
    }

    return (
        <SelectField 
            name="role" value={role} 
            setValue={handleChange} 
            title="Role" options={roleOpts} required="true" 
            disabled={!hasRole('Admin')}
        />
    );
}