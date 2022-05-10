import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../Auth';
import { InputField, TextareaField } from ".";
import axios from "axios";

export default function ProjectForm ({id, project, afterSubmit }) {
    const { addMessage, hasRole } = useUser();
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

    const handleDelete = async e => {
        e.preventDefault();
        let response;

        response = await axios.deleteRequest('api/projects/' + id);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            document.getElementById('project_form_' + id + '_close').click();

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
            <div className="row">
                <div className={"col-" + (id ? 8 : 12) + " d-grid gap-2"}>
                    <button className="btn btn-primary btn-lg" type="submit">{ id ? "Update Project" : "Create Project"}</button>
                </div>
                { id ? 
                <div className="col-4 d-grid gap-2">
                    <button className="btn btn-danger btn-lg" onClick={handleDelete} type="button" 
                    disabled={ hasRole(['Admin', 'Manager']) ? false : true }>Delete Project</button>
                </div>
                : null }
            </div>
        </form>
    );
}