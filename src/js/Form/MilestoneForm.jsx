import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../Auth';
import { InputField, SelectField } from ".";
import axios from "axios";
import TextareaField from "./TextareaField";

export default function MilestoneForm ({id, milestone, afterSubmit }) {
    const { addMessage } = useUser();
    const urlParams = useParams();

    const handleChange = e => {
        setValues(oldValues => ({
          ...oldValues,
          [e.target.name]: e.target.value
        }));
    }

    //Select options
    const [ projects, setProjects ] = useState();

    //Form values
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


    useEffect(() => {
        if (id && !milestone) axios.getRequest('api/milestones/' + urlParams.id, (r) => {
            setValues({ ...r.data });
        });
        else if (milestone) setValues(milestone);
        
        axios.getRequest('api/projects', (r) => {setProjects(r.data.data)});
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        let response;

        if (id) response = await axios.patchRequest('api/milestones/' + id, values);
        else response = await axios.postRequest('api/milestones', values);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
                document.getElementById('milestone_form_' + id + '_close').click();
            } else {
                setValues({ ...defaultValues });
                document.getElementById('milestone_form__close').click();
            }
            
            await addMessage(response.message);
            afterSubmit();
        }
    }


    if (projects) {
        return (
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <SelectField name="project_id" value={values.project_id} errorValue={errors.project_id} setValue={handleChange} options={projects} title="Project" required="required" />
                </div>
                <div className="mb-3">
                    <InputField type="text" name="title" value={values.title} errorValue={errors.title} setValue={handleChange} title="Title" required="required" />
                </div>
                <div className="mb-3">
                    <TextareaField type="text" name="desc" value={values.desc} errorValue={errors.desc} setValue={handleChange} title="Description" required="required" />
                </div>

                <div className="row mb-3">
                    <div className="col-6">
                        <InputField type="datetime-local" name="start_date" value={values.start_date} errorValue={errors.start_date} setValue={handleChange} title="Start Date" />
                    </div>
                    <div className="col-6">
                        <InputField type="datetime-local" name="end_date" value={values.end_date} errorValue={errors.end_date} setValue={handleChange} title="Due Date" />
                    </div>
                </div>

                <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg" type="submit">{ id ? "Edit Milestone" : "Create Milestone"}</button>
                </div>
            </form>
        );
    } else {
        return ("Loading Button");
    }
}