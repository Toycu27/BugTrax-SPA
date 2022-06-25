import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { InputField, TextareaField } from '../form';
import { AlertBox, CommentForm } from '../shared';

export default function ProjectForm({ id, project }) {
    const { addMessage, hasRole } = useContext(GlobalContext);

    // 0 = Fetching, 1 = Done
    const [resultStatus, setResultStatus] = useState(0);
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
            setResultStatus(0);
            axios.getRequest(`api/projects/${urlParams.id}`, (r) => {
                setValues({ ...r.data });
                setResultStatus(1);
            });
        } else if (project) {
            setValues(project);
            setResultStatus(1);
        } else {
            setResultStatus(1);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const callback = (r) => {
            setErrors({ ...defaultErrors });
            if (id) setValues({ ...defaultValues, ...r.data });
            else setValues({ ...defaultValues });

            addMessage(r.message);
            window.scrollTo(0, 0);
        };
        const callbackFail = (r) => {
            setErrors({ ...defaultErrors, ...r.errors });
            addMessage(r.message, 'danger');
        };

        if (id) await axios.patchRequest(`api/projects/${id}`, values, callback, callbackFail);
        else await axios.postRequest('api/projects', values, callback, callbackFail);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        await axios.deleteRequest(`api/projects/${id}`, (r) => {
            addMessage(r.message);
            navigate(-1);
        }, (r) => {
            setErrors({ ...defaultErrors, ...r.errors });
            addMessage(r.message, 'danger');
            window.scrollTo(0, 0);
        });
    };

    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                <div className="col-auto">
                    <button onClick={() => navigate(-1)} type="button" className="btn btn-primary btn-sm" aria-label="Previous Page">
                        <i className="bi bi-arrow-left fs-4" />
                    </button>
                </div>
                <div className="col-auto"><h1>Project</h1></div>
            </div>
            <AlertBox />
            {resultStatus ? (
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
            ) : <div className="loader" />}
            {id && <CommentForm projectId={id} />}
        </div>
    );
}
