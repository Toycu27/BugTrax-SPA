import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { Avatar } from '../shared';

export default function UpdateUserAvatar() {
    const { user, setUser, addMessage } = useContext(GlobalContext);

    const defaultValues = {
        avatar: '',
    };
    const defaultErrors = {
        avatar: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    const handleChange = (e) => {
        setValues((oldValues) => ({
            ...oldValues,
            [e.target.name]: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append(
            'avatar',
            values.avatar,
        );

        await axios.postRequestWithFile(
            `api/users/${user.id}/avatar`,
            formData,
            (r) => {
                setErrors({ ...defaultErrors });
                setUser(r.data);
                addMessage(r.message);
            },
            (r) => {
                setErrors({ ...defaultErrors, ...r.errors });
                addMessage(r.message, 'danger');
            },
        );
    };

    return (
        <div className="row">
            <div className="col-12">
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="row align-items-center">
                        <div className="col-md-auto">
                            <Avatar user={user} size="100" />
                        </div>
                        <div className="col-md-auto">
                            <input
                                aria-describedby="userAvatarFile"
                                className={`form-control ${errors.avatar ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                name="avatar"
                                type="file"
                                accept="image/*"
                            />
                            <button
                                className={`btn btn-primary y-expand ${!values.avatar ? 'invisible' : ''}`}
                                type="submit"
                                disabled={!values.avatar}
                            >
                                Upload
                            </button>
                            <div id="userAvatarFile" className="invalid-feedback">
                                {errors.avatar}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
