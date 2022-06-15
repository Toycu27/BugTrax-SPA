import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../Auth';
import { CommentForm, InputField, TextareaField, SelectField, AlertBox } from '../Form';

export default function MilestoneForm({ id, milestone }) {
    const { addMessage, hasRole } = useContext(GlobalContext);

    // 0 = Fetching, 1 = Done
    const [resultStatus, setResultStatus] = useState(0);
    const navigate = useNavigate();
    const urlParams = useParams();
    if (urlParams.id) id = urlParams.id;

    // Select options
    const [projects, setProjects] = useState();

    // Form values
    const defaultValues = {
        project_id: '',
        title: '',
        desc: '',
        start_date: '',
        end_date: '',
    };
    const defaultErrors = {
        project_id: null,
        title: null,
        desc: null,
        start_date: null,
        end_date: null,
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
        if (id && !milestone) {
            setResultStatus(0);
            axios.getRequest(`api/milestones/${urlParams.id}`, (r) => {
                setValues({ ...r.data.data });
                setResultStatus(1);
            });
        } else if (milestone) {
            setValues(milestone);
            setResultStatus(1);
        } else {
            setResultStatus(1);
        }
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data); });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;

        if (id) response = await axios.patchRequest(`api/milestones/${id}`, values);
        else response = await axios.postRequest('api/milestones', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, 'danger');
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
            } else {
                setValues({ ...defaultValues });
            }

            await addMessage(response.message);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const response = await axios.deleteRequest(`api/milestones/${id}`);

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
                <div className="col-auto"><h1>Milestone</h1></div>
            </div>
            <AlertBox />
            {(resultStatus && projects) ? (
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                        <SelectField
                            name="project_id"
                            value={values.project_id}
                            errorValue={errors.project_id}
                            setValue={handleChange}
                            options={projects}
                            title="Project"
                            required
                        />
                    </div>
                    <div className="mb-3">
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
                    <div className="mb-3">
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

                    <div className="row mb-5 g-3">
                        <div className="col-6 col-lg-3">
                            <InputField
                                type="datetime-local"
                                name="start_date"
                                value={values.start_date}
                                errorValue={errors.start_date}
                                setValue={handleChange}
                                title="Start Date"
                            />
                        </div>
                        <div className="col-6 col-lg-3">
                            <InputField
                                type="datetime-local"
                                name="end_date"
                                value={values.end_date}
                                errorValue={errors.end_date}
                                setValue={handleChange}
                                title="Deadline"
                            />
                        </div>
                        <div className="col-6 col-lg-3">
                            <InputField
                                type="datetime-local"
                                name="created_at"
                                value={values.created_at}
                                title="Created"
                                disabled
                            />
                        </div>
                        <div className="col-6 col-lg-3">
                            <InputField
                                type="datetime-local"
                                name="modified_at"
                                value={values.updated_at}
                                title="Modified"
                                disabled
                            />
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
            {id && <CommentForm milestoneId={id} />}
        </div>
    );
}
