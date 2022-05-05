import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AlertBox, CreateProject, ProjectForm } from "../Form";
import axios from "axios";

export default function Project({user}) {
    const [ project, setProject ] = useState();
    const [ reload, setReload ] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        axios.getRequest('api/projects/' + urlParams.id, (r) => {setProject(r.data)})
    }, [reload]);

    if (project) {
        return (<>
            <div className="row">
                <div className="col-6 text-end"><h2>Project</h2></div>
                <div className="col-6"><ProjectForm id={ project.id } project={ project } setReload={setReload} /></div>
            </div>

            <div className="row">
                <div className="col-6"><h2>{ project.title }</h2></div>
            </div>
            <div className="row mb-2">
                <div className="col-6">{ project.desc }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Created: { new Date(project.created_at).toLocaleDateString() }</div>
            </div>
            <div className="row">
                <div className="col-6">Modified: { new Date(project.updated_at).toLocaleDateString() }</div>
            </div>

            <AlertBox />
        </>);
    } else {
        return (<h1>Loading Project Data</h1>);
    }
}