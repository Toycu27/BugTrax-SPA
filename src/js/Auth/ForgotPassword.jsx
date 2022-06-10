import React, { useState } from "react";
import { InputField, AlertBox } from "../Form";
import { useUser } from '../Auth';
import axios from "axios";

export default function ForgotPassword() {
    const { addMessage } = useUser();

    const handleChange = e => {
        setValues(oldValues => ({
            ...oldValues,
            [e.target.name]: e.target.value
        }));
    }

    //Form values
    const defaultValues = {
        email: '',
    };
    const defaultErrors = {
        email: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);


    const handleSubmit = async e => {
        e.preventDefault();
        let response = await axios.postRequest('forgot-password', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
            addMessage(response.message);
        }
    }

    return (<div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
                <div className="text-center">
                    <div className="mb-3">
                        <h1>Forgot your Password?</h1>
                        <p className="text-muted">We will send a Password reset link to your Email</p>
                    </div>
                    <form onSubmit={handleSubmit} className="needs-validation">
                        <div className="mb-4">
                            <InputField type="text" name="email" value={values.email} errorValue={errors.email} setValue={handleChange} title="Email Address" reqired="required"></InputField>
                        </div>

                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" type="submit">Send link</button>
                        </div>
                    </form>
                </div>
                <AlertBox />
            </div>
        </div>
    </div>);
}