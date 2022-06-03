import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from '../Auth';
import { CommentForm, InputField, TextareaField, SelectField, AlertBox } from ".";
import axios from "axios";

export default function BugForm({ id, bug }) {
    const { addMessage, hasRole } = useUser();
    const navigate = useNavigate();
    const urlParams = useParams();
    if (urlParams.id) id = urlParams.id;

    const handleChange = e => {
        setValues(oldValues => ({
            ...oldValues,
            [e.target.name]: e.target.value
        }));
    }

    //Select field options
    const [projects, setProjects] = useState();
    const [milestones, setMilestones] = useState();
    const [users, setUsers] = useState();
    const statusOpts = ['New', 'Progress', 'Freeze', 'Testing', 'Solved'];
    const priorityOpts = ['Low', 'Normal', 'High', 'Immediate'];
    const deviceTypeOpts = ['Desktop', 'Tablet', 'Mobile'];
    const deviceOsOpts = ['Windows', 'Mac', 'Linux'];
    const difficultyOpts = ['Easy', 'Normal', 'Hard', 'Unknown'];

    //Form values
    const defaultValues = {
        project_id: '',
        milestone_id: '',
        assigned_to: '',
        status: 'New',
        priority: '',
        difficulty: '',
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
        status: null,
        priority: null,
        difficulty: null,
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


    useEffect(() => {
        if (id && !bug) axios.getRequest('api/bugs/' + urlParams.id + '', (r) => {
            setValues({ ...r.data.data });
        });
        else if (bug) setValues(bug);

        axios.getRequest('api/projects', (r) => { setProjects(r.data.data) });
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data.data) });
        axios.getRequest('api/users', (r) => { setUsers(r.data.data) });
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        let response;

        if (id) response = await axios.patchRequest('api/bugs/' + id, values);
        else response = await axios.postRequest('api/bugs', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
            }
            else {
                setValues({ ...defaultValues });
            }

            addMessage(response.message);
            window.scrollTo(0, 0);
        }
    }

    const handleDelete = async e => {
        e.preventDefault();
        let response;

        response = await axios.deleteRequest('api/bugs/' + id);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            addMessage(response.message);
        }

        window.scrollTo(0, 0);
    }


    if (projects && milestones && users) {
        return (<div className="container">
            <div className="row mb-4 mt-1">
                <div className="col-auto">
                    <button onClick={() => navigate(-1)} type="button" className="btn btn-primary btn-sm">
                        <i className="bi bi-arrow-left fs-4"></i>
                    </button>
                </div>
                <div className="col-auto"><h2>Bug</h2></div>
            </div>
            <AlertBox />
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <InputField type="text" name="title" value={values.title} errorValue={errors.title} setValue={handleChange} title="Title" required="required" />
                </div>
                <div className="mb-3">
                    <TextareaField type="text" name="desc" value={values.desc} errorValue={errors.desc} setValue={handleChange} title="Description" required="required" />
                </div>
                <div className="mb-5">
                    <TextareaField type="text" name="solution_desc" value={values.solution_desc} errorValue={errors.solution_desc} setValue={handleChange} title="Solution" />
                </div>
                <div className="row mb-3">
                    <div className="col-4">
                        <SelectField name="project_id" value={values.project_id} errorValue={errors.project_id} setValue={handleChange} options={projects} title="Project" required="required" />
                    </div>
                    <div className="col-4">
                        <SelectField name="milestone_id" value={values.milestone_id} errorValue={errors.milestone_id} setValue={handleChange} options={milestones} title="Milestone" />
                    </div>
                    <div className="col-4">
                        <SelectField name="assigned_to" value={values.assigned_to} errorValue={errors.assigned_to} setValue={handleChange} options={users} title="Assignee" />
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-4">
                        <SelectField name="status" value={values.status} errorValue={errors.status} setValue={handleChange} options={statusOpts} title="Status" required="required" />
                    </div>
                    <div className="col-4">
                        <SelectField name="priority" value={values.priority} errorValue={errors.priority} setValue={handleChange} options={priorityOpts} title="Priority" required="required" />
                    </div>
                    <div className="col-4">
                        <SelectField name="difficulty" value={values.difficulty} errorValue={errors.difficulty} setValue={handleChange} options={difficultyOpts} title="Difficulty" required="required" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-4">
                        <InputField type="text" name="url" value={values.url} errorValue={errors.url} setValue={handleChange} title="URL" />
                    </div>
                    <div className="col-4">
                        <SelectField name="device_type" value={values.device_type} errorValue={errors.device_type} setValue={handleChange} options={deviceTypeOpts} title="Device Type" />
                    </div>
                    <div className="col-4">
                        <SelectField name="device_os" value={values.device_os} errorValue={errors.device_os} setValue={handleChange} options={deviceOsOpts} title="Device OS" />
                    </div>
                </div>
                <div className="mb-3">
                    <TextareaField type="text" name="browser_info" value={values.browser_info} errorValue={errors.browser_info} setValue={handleChange} title="Browser Information" />
                </div>
                <div className="row mb-5">
                    <div className="col-4">
                        <InputField type="datetime-local" name="end_date" value={values.end_date} errorValue={errors.end_date} setValue={handleChange} title="Deadline" />
                    </div>
                    <div className="col-4">
                        <InputField type="datetime-local" name="created_at" value={values.created_at} title="Created" disabled="true" />
                    </div>
                    <div className="col-4">
                        <InputField type="datetime-local" name="modified_at" value={values.updated_at} title="Modified" disabled="true" />
                    </div>
                </div>
                <div className="row">
                    <div className={"col-" + (id ? 8 : 12) + " d-grid gap-2"}>
                        <button className="btn btn-primary btn-lg" type="submit">{id ? "Update" : "Create"}</button>
                    </div>
                    {id ?
                        <div className="col-4 d-grid gap-2">
                            <button className="btn btn-danger btn-lg" onClick={handleDelete} type="button"
                                disabled={hasRole(['Admin', 'Manager']) ? false : true}>Delete</button>
                        </div>
                        : null}
                </div>
            </form>
            {id &&
                <CommentForm bug_id={id} />
            }
        </div>);
    } else {
        return (<div className="container">
            Loading Button
        </div>);
    }
}