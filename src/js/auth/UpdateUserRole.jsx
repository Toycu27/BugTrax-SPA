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

        await axios.patchRequest(
            `api/users/${item.id}`,
            { role: e.target.value },
            (r) => {
                addMessage(r.message);
            },
            (r) => {
                addMessage(r.message, 'danger');
            },
        );
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
