import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { InputField } from '../form';
import { AlertBox } from '../shared';

export default function ResetPassword() {
    const { addMessage } = useContext(GlobalContext);

    const navigate = useNavigate();
    const urlParams = useParams();
    const [searchParams] = useSearchParams();

    const defaultValues = {
        password: '',
        password_confirmation: '',
    };
    const defaultErrors = {
        password: null,
        password_confirmation: null,
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
        await axios.postRequest(
            'reset-password',
            {
                ...values,
                email: searchParams.get('email'),
                token: urlParams.token,
            },
            () => {
                addMessage('Your Password has been reset.');
                navigate('/login');
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
                    <div className="mb-3">
                        <h1>Reset your Password</h1>
                        <p>Set a new Password for your Account</p>
                    </div>
                    <AlertBox />
                    <form onSubmit={handleSubmit} className="needs-validation">
                        <div className="mb-3">
                            <InputField
                                type="text"
                                name="password_confirmation"
                                value={values.password_confirmation}
                                errorValue={errors.password_confirmation}
                                setValue={handleChange}
                                title="Retype Password"
                            />
                        </div>
                        <div className="mb-4">
                            <InputField
                                type="text"
                                name="password"
                                value={values.password}
                                errorValue={errors.password}
                                setValue={handleChange}
                                title="Password"
                                required
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Reset Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
