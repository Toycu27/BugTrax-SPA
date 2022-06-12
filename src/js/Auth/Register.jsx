import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from '../Auth';
import { AlertBox, InputField } from "../Form";
import axios from "axios";

export default function Register() {
    const { addMessage } = useUser();
    let navigate = useNavigate();

    const handleChange = e => {
        setValues(oldValues => ({
            ...oldValues,
            [e.target.name]: e.target.value
        }));
    }

    //Form values
    const defaultValues = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    };
    const defaultErrors = {
        timezone: null,
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await axios.postRequest('register', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            setErrors({ ...defaultErrors });
            setValues({ ...defaultValues });
            addMessage(response.message);
            navigate('/verify');
        }
    }

    return (<div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
                <div className="text-center mb-4">
                    <h1>Create an Account</h1>
                    <div className="text-muted text-center mt-2">
                        <span>Already have an account? </span>
                        <Link className="" to="/login">Login</Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="needs-validation">
                    <InputField type="hidden" name="timezone" value={values.timezone} errorValue={errors.timezone} setValue={handleChange} title="Timezone" required="required" />
                    <div className="mb-3">
                        <InputField type="text" name="name" value={values.name} errorValue={errors.name} setValue={handleChange} title="Username" required="required" />
                    </div>
                    <div className="mb-3">
                        <InputField type="text" name="email" value={values.email} errorValue={errors.email} setValue={handleChange} title="Email Address" required="required" />
                    </div>
                    <div className="mb-3">
                        <InputField type="password" name="password" value={values.password} errorValue={errors.password} setValue={handleChange} title="Password" required="required" />
                    </div>
                    <div className="mb-4">
                        <InputField type="password" name="password_confirmation" value={values.password_confirmation} errorValue={errors.password_confirmation} setValue={handleChange} title="Retype Password" required="required" />
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-lg" type="submit">Sign Up</button>
                    </div>
                </form>
                <AlertBox />
            </div>
        </div>
    </div>);
}