import { fileStoragePath } from '../../App.js';
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertBox, SelectField } from "../Form";
import axios from "axios";

export default function Bugs({ search, title }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateSearchParams = () => {
        setSearchParams({ project: selectedProject, milestone: selectedMilestone, assignee: selectedAssignee })
    }

    const [bugs, setBugs] = useState();
    const [projects, setProjects] = useState();
    const [milestones, setMilestones] = useState();
    const [users, setUsers] = useState();
    const [pagination, setPagination] = useState([]);
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));
    const [selectedMilestone, setSelectedMilestone] = useState(searchParams.get('milestone'));
    const [selectedAssignee, setSelectedAssignee] = useState(searchParams.get('assignee'));

    const getBugs = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/bugs?paginate=5&with=project,milestone,assignedTo'
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
    }, []);

    useEffect(() => {
        getBugs();
        getProjects();
        getMilestones();
        getUsers();
    }, [title]);

    let statusClassMap = {
        'New': 'badge rounded-pill bg-primary',
        'Progress': 'badge rounded-pill bg-warning',
        'Freeze': 'badge rounded-pill bg-dark',
        'Testing': 'badge rounded-pill bg-info',
        'Solved': 'badge rounded-pill bg-success',
    };

    let priorityClassMap = {
        'Low': 'badge bg-primary',
        'Normal': 'badge bg-warning',
        'High': 'badge bg-danger',
        'Immediate': 'badge bg-secondary',
    };

    let difficultyClassMap = {
        'Easy': 'badge rounded-pill bg-primary',
        'Normal': 'badge rounded-pill bg-warning',
        'Hard': 'badge rounded-pill bg-danger',
        'Unknown': 'badge rounded-pill bg-secondary',
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
                    <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value) }} title="Project" options={projects} />
                </div>
                <div className="col-12 col-sm-4 col-lg-4">
                    <SelectField name="selected_milestone" value={selectedMilestone} setValue={(e) => { setSelectedMilestone(e.target.value) }} title="Milestone" options={milestones} />
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
                                            <div className={"bug__value fw-normal fs-6 mb-2 " + statusClassMap[item.status]}>{item.status}</div>
                                        </div>
                                        <div className="col">
                                            <div className="bug__label pb-0 text-muted">Difficulty</div>
                                            <div className={"bug__value fw-normal fs-6 mb-2 " + difficultyClassMap[item.difficulty]}>{item.difficulty}</div>
                                        </div>
                                        <div className="col">
                                            <div className="bug__label pb-0 text-muted">Priority</div>
                                            <div className={"bug__value fw-normal fs-6 mb-2 " + priorityClassMap[item.priority]}>{item.priority}</div>
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