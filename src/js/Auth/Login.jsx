import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../Auth';
import { InputField, AlertBox } from '../Form';

export default function Login() {
    const { setUser, getLastLocation, addMessage } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Form values
    const defaultValues = {
        email: '',
        password: '',
    };
    const defaultErrors = {
        email: null,
        password: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    useEffect(() => {
        if (searchParams.get('verified')) {
            addMessage('Your Account has been verified!');
            setSearchParams({});
        }
    }, []);

    const handleChange = (e) => {
        setValues((oldValues) => ({
            ...oldValues,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.postRequest('sanctum/token', {
            ...values,
            device_name: 'SPA',
        });
        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, 'warning');
        } else {
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
            axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            response.data.user.token = response.data.token;
            setUser(response.data.user);
            navigate(getLastLocation());
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                    <div className="text-center mb-4">
                        <h1>Login</h1>
                        <div className="text-muted text-center mt-2">
                            <span>Don&apos;t have an account? </span>
                            <Link className="" to="/register">Sign Up</Link>
                        </div>
                    </div>
                    <AlertBox />
                    <form onSubmit={handleSubmit} className="needs-validation">
                        <div className="mb-3">
                            <InputField
                                type="text"
                                name="email"
                                value={values.email}
                                errorValue={errors.email}
                                setValue={handleChange}
                                title="Email Address"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <InputField
                                type="password"
                                name="password"
                                value={values.password}
                                errorValue={errors.password}
                                setValue={handleChange}
                                title="Password"
                                required
                            />
                            <Link className="text-right" to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
