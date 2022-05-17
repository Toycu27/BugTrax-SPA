import { fileStoragePath } from '../../App.js';
import { useState } from "react";
import { useUser } from './';
import { AlertBox } from "../Form";
import axios from "axios";

export default function UpdateUserAvatar() {
    const { user, setUser, addMessage } = useUser();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.files[0]
        }));
    }

    const defaultValues = {
        avatar: '',
    };
    const defaultErrors = {
        avatar: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);


    const handleSubmit = async e => {
        e.preventDefault();

        const formData = new FormData(); 
        formData.append(
            "avatar", 
            values.avatar
        ); 
     
        const response = await axios.postRequestWithFile(
            'api/users/' + user.id + '/avatar', 
            formData
        );

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            setErrors({ ...defaultErrors });
            setUser(response.data);
            addMessage(response.message);
        }
    }

    return (
        <div className="row">
            <div className="col-12">
                <AlertBox />
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="row align-items-center">
                        <div className="col-md-auto">
                            <img className="rounded-circle border border-2" height="100px" width="100px" src={user.avatar_path ? fileStoragePath + user.avatar_path : "https://i.pravatar.cc/100?img=" + values.id} />
                        </div>
                        <div className="col-md-auto">
                            <div className="">
                                <input aria-describedby="userAvatarFile" className={"form-control " + (errors.avatar ? "is-invalid" : "")}
                                onChange={handleChange} name="avatar" type="file" accept="image/*" />
                                <div id="userAvatarFile" className="invalid-feedback">
                                    {errors.avatar}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <button className="btn btn-primary" type="submit" disabled={values.avatar ? false : true}>Upload</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}