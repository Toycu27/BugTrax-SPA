import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertBox, ModalBox, BugForm, SelectField } from "../Form";
import axios from "axios";

export default function Bugs({search, title}) {
    const [ bugs, setBugs ] = useState();
    const [ projects, setProjects ] = useState();
    const [ milestones, setMilestones ] = useState();
    const [ pagination, setPagination ] = useState([]);
    const [ selectedProject, setSelectedProject ] = useState();
    const [ selectedMilestone, setSelectedMilestone ] = useState();

    const getBugs = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/bugs?paginate=5&with=project,milestone'
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        if (!isNaN(selectedProject) && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
        if (!isNaN(selectedMilestone) && nextPage === false) requestUrlParams += '&milestone_id=' + selectedMilestone
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setBugs([ ...bugs, ...r.data.data  ])
            else setBugs([ ...r.data.data ])
            setPagination(r.data)
        })
    }

    const handleLoadMore = () => {
        getBugs(true);
    }

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => {setProjects(r.data.data)});
    }

    const getMilestones = () => {
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data.data) });
    }

    useEffect(() => {
        if (selectedProject) getBugs();
    }, [selectedProject]);

    useEffect(() => {
        if (selectedMilestone) getBugs();
    }, [selectedMilestone]);

    useEffect(() => {
        getBugs();
        getProjects();
        getMilestones();
    }, []);

    useEffect(() => {
        getBugs();
        getProjects();
        getMilestones();
    }, [title]);

    return (<>
        <div className="row">
            <div className="col-6 text-end"><h2>Bugs</h2></div>
            { !search ?
            <div className="col-6">
                <ModalBox id="bug_form_" buttonTitle={<i className="bi bi-plus fs-4"></i>}>
                    <BugForm afterSubmit={ getBugs }/>
                </ModalBox>
            </div>
            : null }
        </div>

        { !search ?
        <div className="row">
            <div className="col-4">
                <SelectField name="selected_project" value={selectedProject} setValue={(e) => {setSelectedProject(e.target.value)}} title="Project" options={projects} />
            </div>
            <div className="col-4">
                <SelectField name="selected_milestone" value={selectedMilestone} setValue={(e) => {setSelectedMilestone(e.target.value)}} title="Milestone" options={milestones} />
            </div>
        </div>
        : null }

        <AlertBox />

        { bugs && bugs.length ?
        <div className="row">
            <table className="table table-hover table-borderless">
                <thead>
                    <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Project</th>
                    <th scope="col">Milestone</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Progress</th>
                    <th scope="col">Created</th>
                    <th scope="col">DueDate</th>
                    </tr>
                </thead>
                <tbody>
                    { bugs.map(item => 
                        <tr key={item.id}>
                            <td>
                                <ModalBox id={"bug_form_" + item.id} buttonTitle={ item.title }>
                                    <BugForm id={ item.id } bug={ item } afterSubmit={ getBugs }/>
                                </ModalBox>
                            </td>
                            <td>{ item.project.title }</td>
                            <td>{ item.milestone.title }</td>
                            <td>{ item.status }</td>
                            <td>{ item.priority }</td>
                            <td>{ item.progress }%</td>
                            <td>{new Date(item.created_at).toLocaleDateString()}</td>
                            <td>{new Date(item.end_date).toLocaleDateString()}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        : <h4>No Results found...</h4> }

        { pagination.next_page_url ? 
            <div className="row justify-content-center">
                <div className="col-4 text-center">
                    <button type="button" className="btn btn-info" onClick={ handleLoadMore }>Load More</button>
                </div>
            </div> 
        : null }
    </>);
}