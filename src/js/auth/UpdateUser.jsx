import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UpdateUserAvatar } from '../auth';
import { GlobalContext } from '../';
import { InputField, SelectField } from '../form';
import { AlertBox } from '../shared';

export default function UpdateUser() {
    const { user, setUser, addMessage } = useContext(GlobalContext);

    const defaultValues = {
        timezone: user.timezone,
        name: user.name,
        password_current: '',
        password: '',
        password_confirm: '',
        avatar: '',
    };
    const defaultErrors = {
        timezone: null,
        name: null,
        password_current: null,
        password: null,
        password_confirm: null,
        avatar: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    const handleChange = (e) => {
        setValues((oldValues) => ({
            ...oldValues,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.patchRequest(
            `api/users/${user.id}`,
            { ...values },
            (r) => {
                setErrors({ ...defaultErrors });
                setValues({ ...defaultValues, timezone: values.timezone, name: values.name });
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">

                    <div className="text-center mb-4">
                        <h1>Account Information</h1>
                        <p>You can change your Account Information</p>
                    </div>
                    <AlertBox />
                    <div className="mb-3">
                        <UpdateUserAvatar />
                    </div>
                    <form onSubmit={handleSubmit} className="needs-validation">
                        <div className="mb-3">
                            <SelectField
                                name="timezone"
                                value={values.timezone}
                                errorValue={errors.timezone}
                                setValue={handleChange}
                                options={Intl.supportedValuesOf('timeZone')}
                                title="Timezone"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <InputField
                                type="text"
                                name="name"
                                value={values.name}
                                errorValue={errors.name}
                                setValue={handleChange}
                                title="Username"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <InputField
                                type="password"
                                name="password_current"
                                value={values.password_current}
                                errorValue={errors.password_current}
                                setValue={handleChange}
                                title="Current Password"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <InputField
                                type="password"
                                name="password"
                                value={values.password}
                                errorValue={errors.password}
                                setValue={handleChange}
                                title="New Password"
                            />
                        </div>
                        <div className="mb-4">
                            <InputField
                                type="password"
                                name="password_confirm"
                                value={values.password_confirm}
                                errorValue={errors.password_confirm}
                                setValue={handleChange}
                                title="Retype Password"
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
