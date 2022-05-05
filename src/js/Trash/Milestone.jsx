import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertBox, MilestoneForm } from "../Form";
import axios from "axios";

export default function Milestone({user}) {
    const [ milestone, setMilestone ] = useState();
    const [ reload, setReload ] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        axios.getRequest('api/milestones/' + urlParams.id + '?with=project', (r) => {setMilestone(r.data)});
    }, [reload]);

    if (milestone) {
        return (<>
            <div className="row">
                <div className="col-6 text-end"><h2>Milestone</h2></div>
                <div className="col-6"><MilestoneForm id={ milestone.id } milestone={ milestone } setReload={setReload} /></div>
            </div>

            <div className="row">
                <div className="col-6"><h2>{ milestone.title }</h2></div>
            </div>
            <div className="row mb-2">
                <div className="col-6">{ milestone.desc }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Project: <Link className="" to={"/project/" + milestone.project.id }>{ milestone.project.title }</Link></div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Start Date: { new Date(milestone.start_date).toLocaleDateString() }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Due Date: { new Date(milestone.end_date).toLocaleDateString() }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Created: { new Date(milestone.created_at).toLocaleDateString() }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Modified: { new Date(milestone.updated_at).toLocaleDateString() }</div>
            </div>

            <AlertBox />
        </>);
    } else {
        return (<h1>Loading Milestone Data</h1>);
    }
}