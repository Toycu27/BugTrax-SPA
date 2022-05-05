import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../Auth';
import { InputField, TextareaField, SelectField, ModalBox } from ".";
import axios from "axios";

export default function BugForm ({id, bug, afterSubmit }) {
    const { addMessage } = useUser();
    const urlParams = useParams();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    //Select field options
    const [ projects, setProjects ] = useState();
    const [ milestones, setMilestones ] = useState();
    const [ users, setUsers ] = useState();
    const statusOpts = ['New', 'Progress', 'Freeze', 'Testet', 'Solved'];
    const priorityOpts = ['Immediate', 'High', 'Normal', 'Low'];
    const progressOpts = {0: '0%', 10: '10%', 20: '20%', 30: '30%', 40: '40%', 50: '50%', 60: '60%', 70: '70%', 80: '80%', 90: '90%', 100: '100%'};
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
        progress: 0,
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
        progress: null,
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
        if (id && !bug) axios.getRequest('api/bugs/' + urlParams.id, (r) => {
            setValues({ ...r.data });
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
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
                document.getElementById('bug_form_' + id + '_close').click();
            }
            else {
                setValues({ ...defaultValues });
                document.getElementById('bug_form__close').click();
            }
            
            await addMessage(response.message);
            afterSubmit();
        }
    }


    if (projects && milestones && users) {
        return (
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <InputField type="text" name="title" value={values.title} errorValue={errors.title} setValue={handleChange} title="Title" required="required" />
                </div>
                <div className="mb-3">
                    <TextareaField type="text" name="desc" value={values.desc} errorValue={errors.desc} setValue={handleChange} title="Description" required="required" />
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
                <div className="row mb-3">
                    <div className="col-4">
                        <SelectField name="status" value={values.status} errorValue={errors.status} setValue={handleChange} options={statusOpts} title="Status" required="required" />
                    </div>
                    <div className="col-4">
                        <SelectField name="priority" value={values.priority} errorValue={errors.priority} setValue={handleChange} options={priorityOpts} title="Priority" required="required" />
                    </div>
                    <div className="col-4">
                        <SelectField name="progress" value={values.progress} errorValue={errors.progress} setValue={handleChange} options={progressOpts} title="Progress" required="required" />
                    </div>
                </div>
                <div className="mb-3">
                    <InputField type="text" name="url" value={values.url} errorValue={errors.url} setValue={handleChange} title="URL" />
                </div>
                <div className="mb-3">
                    <TextareaField type="text" name="solution_desc" value={values.solution_desc} errorValue={errors.solution_desc} setValue={handleChange} title="Solution Description" />
                </div>
                <div className="row mb-3">
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
                <div className="row mb-3">
                <div className="col-4">
                        <SelectField name="difficulty" value={values.difficulty} errorValue={errors.difficulty} setValue={handleChange} options={difficultyOpts} title="Difficulty" required="required" />
                    </div>
                    <div className="col-4">
                        <InputField type="datetime-local" name="end_date" value={values.end_date} errorValue={errors.end_date} setValue={handleChange} title="Due Date" />
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg" type="submit">{ id ? "Edit Bug" : "Create Bug"}</button>
                </div>
            </form>
        );
    } else {
        return ("Loading Button");
    }
}