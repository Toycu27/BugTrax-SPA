import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../Auth';
import { InputField } from ".";
import axios from "axios";
import TextareaField from "./TextareaField";

export default function ProjectForm ({id, project, afterSubmit }) {
    const { addMessage } = useUser();
    const urlParams = useParams();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    //Form values
    const defaultValues = {
        title: '',
        desc: '',
    };
    const defaultErrors = {
        title: null,
        desc: null,
    };
    const [values, setValues] = useState(defaultValues);
    const [errors, setErrors] = useState(defaultErrors);

    useEffect(() => {
        if (id && !project) axios.getRequest('api/projects/' + urlParams.id, (r) => {
            setValues({ ...r.data });
        });
        else if (project) setValues(project);
        
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        let response;

        if (id) response = await axios.patchRequest('api/projects/' + id, values);
        else response = await axios.postRequest('api/projects', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
                document.getElementById('project_form_' + id + '_close').click();
            } else {
                setValues({ ...defaultValues });
                document.getElementById('project_form__close').click();
            }
            
            await addMessage(response.message);
            afterSubmit();
        }
    }


    return (
        <form onSubmit={handleSubmit} className="needs-validation">
            <div className="mb-3">
                <InputField type="text" name="title" value={values.title} errorValue={errors.title} setValue={handleChange} title="Title" required="required" />
            </div>
            <div className="mb-3">
                <TextareaField type="text" name="desc" value={values.desc} errorValue={errors.desc} setValue={handleChange} title="Description" required="required" />
            </div>
            <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg" type="submit">{ id ? "Edit Project" : "Create Project"}</button>
            </div>
        </form>
    );
}