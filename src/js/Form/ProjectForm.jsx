import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../Auth';
import { CommentForm, InputField, TextareaField, AlertBox } from '../Form';

export default function ProjectForm({ id, project }) {
    const { addMessage, hasRole } = useContext(GlobalContext);

    const navigate = useNavigate();
    const urlParams = useParams();
    if (urlParams.id) id = urlParams.id;

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

    const handleChange = (e) => {
        setValues((oldValues) => ({
            ...oldValues,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (id && !project) {
            axios.getRequest(`api/projects/${urlParams.id}`, (r) => {
                setValues({ ...r.data.data });
            });
        } else if (project) setValues(project);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;

        if (id) response = await axios.patchRequest(`api/projects/${id}`, values);
        else response = await axios.postRequest('api/projects', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, 'danger');
        } else {
            setErrors({ ...defaultErrors });
            if (id) setValues({ ...defaultValues, ...response.data });
            else setValues({ ...defaultValues });

            addMessage(response.message);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const response = await axios.deleteRequest(`api/projects/${id}`);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, 'danger');
        } else {
            addMessage(response.message);
            navigate(-1);
        }
    };

    return (
        <div className="container">
            <div className="row mb-4 mt-1">
                <div className="col-auto">
                    <button onClick={() => navigate(-1)} type="button" className="btn btn-primary btn-sm" aria-label="Previous Page">
                        <i className="bi bi-arrow-left fs-4" />
                    </button>
                </div>
                <div className="col-auto"><h1>Project</h1></div>
            </div>
            <AlertBox />
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row mb-3">
                    <div className="col-12">
                        <InputField
                            type="text"
                            name="title"
                            value={values.title}
                            errorValue={errors.title}
                            setValue={handleChange}
                            title="Title"
                            required
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <TextareaField
                            type="text"
                            name="desc"
                            value={values.desc}
                            errorValue={errors.desc}
                            setValue={handleChange}
                            title="Description"
                            required
                        />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-4">
                        <InputField type="datetime-local" name="created_at" value={values.created_at} title="Created" disabled />
                    </div>
                    <div className="col-4">
                        <InputField type="datetime-local" name="modified_at" value={values.updated_at} title="Modified" disabled />
                    </div>
                </div>

                <div className="row">
                    <div className={`col-${id ? 8 : 12} d-grid gap-2`}>
                        <button className="btn btn-primary btn-lg" type="submit">{id ? 'Update' : 'Create'}</button>
                    </div>
                    {id && (
                        <div className="col-4 d-grid gap-2">
                            <button
                                className="btn btn-danger btn-lg"
                                onClick={handleDelete}
                                type="button"
                                disabled={!hasRole(['Admin', 'Manager'])}
                            >
                                Delete

                            </button>
                        </div>
                    )}
                </div>
            </form>
            {id && <CommentForm project_id={id} />}
        </div>
    );
}
