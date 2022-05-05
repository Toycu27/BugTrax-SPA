import React, { useState } from "react";
import { useUser } from './';
import { InputField, AlertBox } from "../Form";
import axios from "axios";

export default function UpdateUser() {
    const { user, setUser, addMessage } = useUser();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    const defaultValues = {
        name: '',
        password_current: '',
        password: '',
        password_confirm: '',
    };
    const defaultErrors = {
        name: null,
        password_current: null,
        password: null,
        password_confirm: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);


    const handleSubmit = async e => {
        e.preventDefault();
        const response = await axios.patchRequest('api/users/' + user.id, {
            ...values, 
            'id': user.id,
        });

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            setValues({...defaultValues, name: values.name});
            setUser(response.data);
            addMessage('Your Account information has been updated.');
        }
    }

    return (
        <div className="row justify-content-md-center">
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-header text-center">
                        <h2>Account Information</h2>
                        <p>You can change your Username and Password</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="needs-validation">
                            <div className="mb-3">
                                <InputField type="text" name="name" value={values.name} errorValue={errors.name} setValue={handleChange} title="Username" required="required" />
                            </div>
                            <div className="mb-3">
                                <InputField type="password" name="password_current" value={values.password_current} errorValue={errors.password_current} setValue={handleChange} title="Current Password" required="required" />
                            </div>
                            <div className="mb-3">
                                <InputField type="password" name="password" value={values.password} errorValue={errors.password} setValue={handleChange} title="New Password" required="required" />                                
                            </div>
                            <div className="mb-4">
                                <InputField type="password" name="password_confirm" value={values.password_confirm} errorValue={errors.password_confirm} setValue={handleChange} title="Retype New Password" required="required" />
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <AlertBox />
            </div>
        </div>
    );
}