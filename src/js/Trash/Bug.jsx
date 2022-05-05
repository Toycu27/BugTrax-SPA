import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertBox, BugForm } from "../Form";
import axios from "axios";

export default function Bug({user}) {
    const [ bug, setBug ] = useState();
    const [ reload, setReload ] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        axios.getRequest('api/bugs/' + urlParams.id + '?with=project,milestone,assignedTo', (r) => {setBug(r.data)});
    }, [reload]);

    if (bug) {
        return (<>
            <div className="row">
                <div className="col-6 text-end"><h2>Bug</h2></div>
                <div className="col-6"><BugForm id={ bug.id } bug={ bug } setReload={setReload} /></div>
            </div>

            <div className="row">
                <div className="col-6"><h2>{ bug.title }</h2></div>
            </div>
            <div className="row mb-2">
                <div className="col-6">{ bug.desc }</div>
            </div>

            <div className="row mb-1">
                <div className="col-6">Project: <Link className="" to={"/project/" + bug.project.id }>{ bug.project.title }</Link></div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Milestone: <Link className="" to={"/milestone/" + bug.milestone.id }>{ bug.milestone.title }</Link></div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Assignee: { bug.assigned_to.name }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Status: { bug.status }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Priority: { bug.priority }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Progress: { bug.progress }%</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Due Date: { new Date(bug.end_date).toLocaleDateString() }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Created: { new Date(bug.created_at).toLocaleDateString() }</div>
            </div>
            <div className="row mb-1">
                <div className="col-6">Modified: { new Date(bug.updated_at).toLocaleDateString() }</div>
            </div>

            <AlertBox />
        </>);
    } else {
        return (<h1>Loading Bug Data</h1>);
    }
}