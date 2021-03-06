import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { InputField, TextareaField, SelectField } from '../form';
import { Avatar, AlertBox, CommentForm } from '../shared';

export default function BugForm({ id, bug }) {
    const { addMessage, hasRole } = useContext(GlobalContext);

    // 0 = Fetching, 1 = Done
    const [resultStatus, setResultStatus] = useState(0);
    const navigate = useNavigate();
    const urlParams = useParams();
    if (urlParams.id) id = urlParams.id;

    // Select field options
    const [projects, setProjects] = useState();
    const [milestones, setMilestones] = useState();
    const [users, setUsers] = useState();
    const statusOpts = { 1: 'New', 2: 'Progress', 3: 'Review', 4: 'Done' };
    const priorityOpts = { 1: 'Low', 2: 'Normal', 3: 'High' };
    const difficultyOpts = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    const deviceTypeOpts = ['Desktop', 'Tablet', 'Mobile'];
    const deviceOsOpts = ['Windows', 'Mac', 'Linux'];

    // Form values
    const defaultValues = {
        project_id: '',
        milestone_id: '',
        assigned_to: '',
        created_by: '',
        status_id: 'New',
        priority_id: '',
        difficulty_id: '',
        title: '',
        desc: '',
        solution_desc: '',
        url: '',
        device_type: '',
        device_os: '',
        browser_info: '',
        end_date: '',
    };
    const defaultErrors = {
        project_id: null,
        milestone_id: null,
        assigned_to: null,
        status_id: null,
        priority_id: null,
        difficulty_id: null,
        title: null,
        desc: null,
        solution_desc: null,
        url: null,
        device_type: null,
        device_os: null,
        browser_info: null,
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
        if (id && !bug) {
            setResultStatus(0);
            axios.getRequest(`api/bugs/${urlParams.id}`, (r) => {
                setValues({ ...r.data });
                setResultStatus(1);
            });
        } else if (bug) {
            setValues(bug);
            setResultStatus(1);
        } else {
            setResultStatus(1);
        }

        axios.getRequest('api/projects', (r) => { setProjects(r.data); });
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data); });
        axios.getRequest('api/users', (r) => { setUsers(r.data); });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const callback = (r) => {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...r.data });
            } else {
                setValues({ ...defaultValues });
            }
            addMessage(r.message);
            window.scrollTo(0, 0);
        };
        const callbackFail = (r) => {
            setErrors({ ...defaultErrors, ...r.errors });
            addMessage(r.message, 'danger');
        };

        if (id) await axios.patchRequest(`api/bugs/${id}`, values, callback, callbackFail);
        else await axios.postRequest('api/bugs', values, callback, callbackFail);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        await axios.deleteRequest(`api/bugs/${id}`, (r) => {
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
                <div className="col-auto"><h1>Bug</h1></div>
            </div>
            <AlertBox />
            {(resultStatus && projects && milestones && users) ? (
                <form onSubmit={handleSubmit} className="needs-validation">
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
                    <div className="mb-5">
                        <TextareaField
                            type="text"
                            name="solution_desc"
                            value={values.solution_desc}
                            errorValue={errors.solution_desc}
                            setValue={handleChange}
                            title="Solution"
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
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
                        <div className="col-4">
                            <SelectField
                                name="milestone_id"
                                value={values.milestone_id}
                                errorValue={errors.milestone_id}
                                setValue={handleChange}
                                options={milestones}
                                title="Milestone"
                            />
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-4">
                            <div className="row">
                                <div className="col">
                                    <SelectField
                                        name="assigned_to"
                                        value={values.assigned_to}
                                        errorValue={errors.assigned_to}
                                        setValue={handleChange}
                                        options={users}
                                        title="Assignee"
                                    />
                                </div>
                                <div className="col-auto ps-0">
                                    {values.assigned_to > 0
                                        // eslint-disable-next-line eqeqeq
                                        ? <Avatar user={users.find((user) => user.id == values.assigned_to)} size={58} />
                                        : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="58"
                                                height="58"
                                                fill="currentColor"
                                                className="bi bi-person-fill bg-form-main color-text-secondary rounded-circle"
                                                viewBox="0 0 16 12"
                                            >
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            </svg>
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col">
                                    <SelectField
                                        name="created_by"
                                        value={values.created_by}
                                        options={users}
                                        title="Creator"
                                        disabled
                                    />
                                </div>
                                <div className="col-auto ps-0">
                                    {values.created_by > 0
                                        // eslint-disable-next-line eqeqeq
                                        ? <Avatar user={users.find((user) => user.id == values.created_by)} size={58} />
                                        : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="58"
                                                height="58"
                                                fill="currentColor"
                                                className="bi bi-person-fill bg-form-main color-text-secondary rounded-circle"
                                                viewBox="0 0 16 12"
                                            >
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            </svg>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <InputField
                                type="text"
                                name="url"
                                value={values.url}
                                errorValue={errors.url}
                                setValue={handleChange}
                                title="URL"
                            />
                        </div>
                        <div className="col-4">
                            <SelectField
                                name="device_type"
                                value={values.device_type}
                                errorValue={errors.device_type}
                                setValue={handleChange}
                                options={deviceTypeOpts}
                                title="Device Type"
                            />
                        </div>
                        <div className="col-4">
                            <SelectField
                                name="device_os"
                                value={values.device_os}
                                errorValue={errors.device_os}
                                setValue={handleChange}
                                options={deviceOsOpts}
                                title="Device OS"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <TextareaField
                            type="text"
                            name="browser_info"
                            value={values.browser_info}
                            errorValue={errors.browser_info}
                            setValue={handleChange}
                            title="Browser Information"
                        />
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <SelectField
                                name="status_id"
                                value={values.status_id}
                                errorValue={errors.status_id}
                                setValue={handleChange}
                                options={statusOpts}
                                title="Status"
                                required
                            />
                        </div>
                        <div className="col-4">
                            <SelectField
                                name="priority_id"
                                value={values.priority_id}
                                errorValue={errors.priority_id}
                                setValue={handleChange}
                                options={priorityOpts}
                                title="Priority"
                                required
                            />
                        </div>
                        <div className="col-4">
                            <SelectField
                                name="difficulty_id"
                                value={values.difficulty_id}
                                errorValue={errors.difficulty_id}
                                setValue={handleChange}
                                options={difficultyOpts}
                                title="Difficulty"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-4">
                            <InputField
                                type="datetime-local"
                                name="end_date"
                                value={values.end_date}
                                errorValue={errors.end_date}
                                setValue={handleChange}
                                title="Deadline"
                            />
                        </div>
                        <div className="col-4">
                            <InputField
                                type="datetime-local"
                                name="created_at"
                                value={values.created_at}
                                title="Created"
                                disabled
                            />
                        </div>
                        <div className="col-4">
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
            {id && <CommentForm bugId={id} />}
        </div>
    );
}
