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
        let requestUrl = nextPage ? pagination.next_page_url : 'api/bugs?paginate=5&with=project,milestone,assignedTo'
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

    let statusClassMap = {
        'New': 'badge rounded-pill bg-secondary',
        'Progress': 'badge rounded-pill bg-warning',
        'Freeze': 'badge rounded-pill bg-info',
        'Testet': 'badge rounded-pill bg-primary',
        'Solved': 'badge rounded-pill bg-success',
    };

    let priorityClassMap = {
        'Immediate': 'badge bg-secondary',
        'High': 'badge bg-danger',
        'Normal': 'badge bg-warning',
        'Low': 'badge bg-primary',
    };

    return (<>
        <div className="row">
            { !search ?
            <div className="col-auto">
                <ModalBox id="bug_form_" buttonTitle={<i className="bi bi-plus mx-2 fs-4"></i>}>
                    <BugForm afterSubmit={ getBugs }/>
                </ModalBox>
            </div>
            : null }
            <div className="col-auto"><h2>Bugs</h2></div>
        </div>

        { !search ?
        <div className="row mt-3">
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
        <div className="bugs row mt-4 g-4">
            { bugs.map(item => 
                <div key={item.id} className="col-12">
                <div className="bug__item px-3 py-2">
                    <div className="row">
                        <div className="col-4">
                            <div className="bug__label pb-0 text-muted">Bug</div>
                            <div className="bug__value mb-2">
                                <ModalBox id={"bug_form_" + item.id} buttonStyle="link" buttonTitle={ item.title }>
                                    <BugForm id={ item.id } bug={ item } afterSubmit={ getBugs }/>
                                </ModalBox>
                            </div>
                            <div className="bug__label pb-0 text-muted">Project</div>
                            <div className="bug__value mb-2">{ item.project.title }</div>
                            <div className="bug__label pb-0 text-muted">Milestone</div>
                            <div className="bug__value">{ item.milestone.title }</div>
                        </div>
                        <div className="col-1">
                            <div className="bug__label pb-0 text-muted">Status</div>
                            <div className={"bug__value mb-2 " + statusClassMap[item.status]}>{ item.status }</div>
                        </div>
                        <div className="col-2">
                            <div className="bug__label pb-0 text-muted">Progress</div>
                            <div className="bug__value mb-2">
                                <div class="progress">
                                    <div class="progress-bar bg-info" style={{width: + (item.progress ? item.progress : 0) + "%"}} 
                                    role="progressbar" aria-valuenow={ item.progress } aria-valuemin="0" aria-valuemax="100">
                                        {item.progress > 10 ? item.progress + "%" : null }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-1">
                            <div className="bug__label pb-0 text-muted">Priority</div>
                            <div className={"bug__value mb-2 " + priorityClassMap[item.priority]}>{ item.priority }</div>
                        </div>
                        <div className="col-2">
                            <div className="bug__label pb-0 text-muted">Created</div>
                            <div className="bug__value mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
                            <div className="bug__label pb-0 text-muted">Due</div>
                            <div className="bug__value mb-2">{new Date(item.end_date).toLocaleDateString()}</div>
                        </div>
                        <div className="col-2">
                            <div className="bug__label pb-0 text-muted">Assignee</div>
                            <div className="bug__value mb-2">{ item.assigned_to ? item.assigned_to.name : null }</div>
                        </div>
                    </div>
                </div>
                </div>
            )}
        </div>
        : <div className="row mt-4">
            <h4>No Results found...</h4>
        </div> }

        { pagination.next_page_url ? 
            <div className="row justify-content-center mt-4">
                <div className="col-4 text-center">
                    <button type="button" className="btn btn-primary" onClick={ handleLoadMore }>
                        <i class="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div> 
        : null }
    </>);
}