import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from './';
import { InputField, AlertBox } from "../Form";
import axios from "axios";

export default function Login({ setUser }) {
    const { getLastLocation } = useUser();
    let navigate = useNavigate();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    //Form values
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


    const handleSubmit = async e => {
        e.preventDefault();
        let response = await axios.postRequest('sanctum/token', {
            ...values, 
            "device_name": 'SPA',
        });
        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
            axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.token;
            response.data.user.token = response.data.token;
            setUser(response.data.user);
            navigate(getLastLocation());
        }
    }


    return (
        <div className="row justify-content-md-center">
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Login</h2>
                        <p>Please login to your account</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="needs-validation">
                            <div className="mb-3">
                                <InputField type="text" name="email" value={values.email} errorValue={errors.email} setValue={handleChange} title="Email Address" required="required" />
                            </div>
                            <div className="mb-4">
                                <InputField type="password" name="password" value={values.password} errorValue={errors.password} setValue={handleChange} title="Password" required="required" />
                                <Link className="text-right" to="/forgot-password">Forgot Password?</Link>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary btn-lg" type="submit">Login</button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer text-muted text-center">
                        <span>Dont have an account? </span>
                        <Link className="" to="/register">Sign Up</Link>
                    </div>
                </div>
                <AlertBox />
            </div>
        </div>
    );
}