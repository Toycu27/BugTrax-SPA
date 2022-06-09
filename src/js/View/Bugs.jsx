import { fileStoragePath } from '../../App.js';
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertBox, SelectField } from "../Form";
import axios from "axios";

export default function Bugs({ search, title }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateSearchParams = () => {
        let tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        if (selectedMilestone > 0) tmpSearchParams.milestone = selectedMilestone;
        if (selectedAssignee > 0) tmpSearchParams.assignee = selectedAssignee;
        setSearchParams(tmpSearchParams);
    }

    const [bugs, setBugs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));
    const [selectedMilestone, setSelectedMilestone] = useState(searchParams.get('milestone'));
    const [selectedAssignee, setSelectedAssignee] = useState(searchParams.get('assignee'));

    const getBugs = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url 
        : 'api/bugs?paginate=5&with=project,milestone,status,priority,difficulty,assignedTo';
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        if (selectedProject > 0 && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
        if (selectedMilestone > 0 && nextPage === false) requestUrlParams += '&milestone_id=' + selectedMilestone
        if (selectedAssignee > 0 && nextPage === false) requestUrlParams += '&assigned_to=' + selectedAssignee
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setBugs([...bugs, ...r.data.data])
            else setBugs([...r.data.data])
            setPagination(r.data)
        })
    }

    const handleLoadMore = () => {
        getBugs(true);
    }

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data) });
    }

    const getMilestones = () => {
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data.data) });
    }

    const getUsers = () => {
        axios.getRequest('api/users', (r) => { setUsers(r.data.data) });
    }

    useEffect(() => {
        if (selectedProject || selectedMilestone || selectedAssignee) {
            getBugs();
            updateSearchParams();
        }

    }, [selectedProject, selectedMilestone, selectedAssignee]);

    useEffect(() => {
        getBugs();
        getProjects();
        getMilestones();
        getUsers();
    }, [title]);

    const selectableMilestones = useMemo(() => {
        let filteredMilestones = [];

        if (milestones.length > 0 && selectedProject > 0) {
            milestones.forEach(milestone => {
                if (milestone.project_id == selectedProject) {
                    filteredMilestones.push(milestone);
                }
            });
        } else {
            return milestones;
        }

        return filteredMilestones;
    }, [selectedProject, projects, milestones]);

    let statusClassMap = {
        1: 'badge rounded-pill bg-primary',
        2: 'badge rounded-pill bg-warning',
        3: 'badge rounded-pill bg-info',
        4: 'badge rounded-pill bg-success',
    };

    let priorityClassMap = {
        1: 'badge bg-primary',
        2: 'badge bg-warning',
        3: 'badge bg-danger',
    };

    let difficultyClassMap = {
        1: 'badge rounded-pill bg-primary',
        2: 'badge rounded-pill bg-warning',
        3: 'badge rounded-pill bg-danger',
    };

    return (<div className="container">
        <div className="row mb-4 mt-1">
            {!search ?
                <div className="col-auto">
                    <Link to="/bug">
                        <button type="button" className="btn btn-primary btn-sm">
                            <i className="bi bi-plus fs-4"></i>
                        </button>
                    </Link>
                </div>
                : null}
            <div className="col-auto"><h2>Bugs</h2></div>
        </div>

        {!search ?
            <div className="row mb-5 gy-2">
                <div className="col-12 col-sm-4 col-lg-4">
                    <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value); setSelectedMilestone(null) }} title="Project" options={projects} />
                </div>
                <div className="col-12 col-sm-4 col-lg-4">
                    <SelectField name="selected_milestone" value={selectedMilestone} setValue={(e) => { setSelectedMilestone(e.target.value) }} title="Milestone" options={selectableMilestones} />
                </div>
                <div className="col-12 col-sm-4 col-lg-4">
                    <SelectField name="selected_assignee" value={selectedAssignee} setValue={(e) => { setSelectedAssignee(e.target.value) }} title="Assignee" options={users} />
                </div>
            </div>
            : null}

        <AlertBox />

        {bugs && bugs.length ?
            <div className="bugs row mb-4 g-4">
                {bugs.map(item =>
                    <div key={item.id} className="col-12">
                        <div className="bug__item px-3 py-2">
                            <div className="row">
                                <div className="col-5 col-lg-4">
                                    <div className="bug__label pb-0 text-muted">Bug</div>
                                    <div className="bug__value mb-2">
                                        <Link to={"/bug/" + item.id}>{item.title}</Link>
                                    </div>
                                    <div className="bug__label pb-0 text-muted">Project</div>
                                    <div className="bug__value mb-2">{item.project ? item.project.title : "Not Selected"}</div>
                                    <div className="bug__label pb-0 text-muted">Milestone</div>
                                    <div className="bug__value">{item.milestone ? item.milestone.title : "Not Selected"}</div>
                                </div>
                                <div className="col-3 col-lg-4">
                                    <div className="row row-cols-1 row-cols-lg-3">
                                        <div className="col">
                                            <div className="bug__label pb-0 text-muted">Status</div>
                                            {item.status && <div className={"bug__value fw-normal fs-6 mb-2 " + statusClassMap[item.status_id]}>{item.status.title}</div> }
                                        </div>
                                        <div className="col">
                                            <div className="bug__lyabel pb-0 text-muted">Difficulty</div>
                                            {item.difficulty && <div className={"bug__value fw-normal fs-6 mb-2 " + difficultyClassMap[item.difficulty_id]}>{item.difficulty.title}</div> }
                                        </div>
                                        <div className="col">
                                            <div className="bug__label pb-0 text-muted">Priority</div>
                                            {item.priority && <div className={"bug__value fw-normal fs-6 mb-2 " + priorityClassMap[item.priority_id]}>{item.priority.title}</div> }
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-2">
                                    <div className="bug__label pb-0 text-muted">Created</div>
                                    <div className="bug__value mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
                                    <div className="bug__label pb-0 text-muted">Modified</div>
                                    <div className="bug__value mb-2">{new Date(item.updated_at).toLocaleDateString()}</div>
                                    <div className="bug__label pb-0 text-muted">Deadline</div>
                                    <div className="bug__value mb-2">{new Date(item.end_date).toLocaleDateString()}</div>
                                </div>
                                <div className="col-2">
                                    <div className="bug__label pb-0 text-muted">Assignee</div>
                                    <div className="bug__value mb-2">
                                        {item.assigned_to &&
                                            <div className="">
                                                <div className="">
                                                    <img className="rounded-circle border border-1" height="50px" width="50px"
                                                        src={item.assigned_to.avatar_path ? fileStoragePath + item.assigned_to.avatar_path : "https://i.pravatar.cc/50?img=" + item.assigned_to.id} />
                                                </div>
                                                <div className="">{item.assigned_to.name}</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            : <div className="row mb-4">
                <p>No Results found...</p>
            </div>}

        {pagination.next_page_url ?
            <div className="row justify-content-center">
                <div className="col-4 text-center">
                    <button type="button" className="btn btn-primary" onClick={handleLoadMore}>
                        <i className="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div>
            : null}
    </div>);
}