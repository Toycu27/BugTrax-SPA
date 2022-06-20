import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { SelectField } from '../form';

export default function UpdateUserRole({ item }) {
    const { hasRole, addMessage } = useContext(GlobalContext);

    const [role, setRole] = useState(item.role);
    const roleOpts = ['Admin', 'Manager', 'Member', 'Client'];

    const handleChange = async (e) => {
        setRole(e.target.value);

        const response = await axios.patchRequest(
            `api/users/${item.id}`,
            { role: e.target.value },
        );

        if (response.errors) {
            addMessage(response.message, 'danger');
        } else {
            addMessage(response.message);
        }
    };

    return (
        <SelectField
            name="role"
            value={role}
            setValue={handleChange}
            title="Role"
            options={roleOpts}
            required
            disabled={!hasRole('Admin')}
        />
    );
}
