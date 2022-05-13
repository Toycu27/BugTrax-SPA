import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from '../Auth';
import { InputField, SelectField, AlertBox } from ".";
import axios from "axios";
import TextareaField from "./TextareaField";

export default function MilestoneForm ({id, milestone }) {
    const { addMessage, hasRole } = useUser();
    const urlParams = useParams();
    if (urlParams.id) id = urlParams.id;

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
            setValues({ ...r.data.data });
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
            addMessage(response.message, "danger");
        } else {
            setErrors({ ...defaultErrors });
            if (id) {
                setValues({ ...defaultValues, ...response.data });
            } else {
                setValues({ ...defaultValues });
            }
            
            await addMessage(response.message);
        }
    }

    const handleDelete = async e => {
        e.preventDefault();
        let response;

        response = await axios.deleteRequest('api/milestones/' + id);

        if (response.errors) {
            setErrors({ ...defaultErrors, ...response.errors });
            addMessage(response.message, "danger");
        } else {
            await addMessage(response.message);
        }
    }


    if (projects) {
        return (<>
            <div className="row mb-4 mt-1">
                <div className="col-auto">
                    <Link to="/milestones">
                        <button type="button" className="btn btn-primary btn-sm">
                            <i className="bi bi-arrow-left fs-4"></i>
                        </button>
                    </Link>
                </div>
                <div className="col-auto"><h2>Milestone</h2></div>
            </div>
            <AlertBox />
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
                <div className="row">
                    <div className={"col-" + (id ? 8 : 12) + " d-grid gap-2"}>
                        <button className="btn btn-primary btn-lg" type="submit">{ id ? "Update" : "Create"}</button>
                    </div>
                    { id ? 
                    <div className="col-4 d-grid gap-2">
                        <button className="btn btn-danger btn-lg" onClick={handleDelete} type="button" 
                        disabled={ hasRole(['Admin', 'Manager']) ? false : true }>Delete</button>
                    </div>
                    : null }
                </div>

            </form>
        </>);
    } else {
        return ("Loading Button");
    }
}