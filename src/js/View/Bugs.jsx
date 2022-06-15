import { Link, useSearchParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AlertBox, SelectField } from '../Form';
import { Avatar } from '../View';

export default function Bugs({ search, title }) {
    // 0 = Fetching, 1 = Success, 2 = No Result, 3 = Fetch Next Page
    const [resultStatus, setResultStatus] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const [bugs, setBugs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const filterOpts = {
        created_asc: 'Created ASC',
        created_desc: 'Created DESC',
        end_asc: 'End ASC',
        end_desc: 'End DESC',
        modified_asc: 'Modified ASC',
        modified_desc: 'Modified DESC',
    };
    const filterQuerys = {
        created_asc: '&sort[created_at]=ASC',
        created_desc: '&sort[created_at]=DESC',
        end_asc: '&sort[end_date]=ASC',
        end_desc: '&sort[end_date]=DESC',
        modified_asc: '&sort[updated_at]=ASC',
        modified_desc: '&sort[updated_at]=DESC',
    };
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));
    const [selectedMilestone, setSelectedMilestone] = useState(searchParams.get('milestone'));
    const [selectedAssignee, setSelectedAssignee] = useState(searchParams.get('assignee'));

    const updateSearchParams = () => {
        const tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        if (selectedMilestone > 0) tmpSearchParams.milestone = selectedMilestone;
        if (selectedAssignee > 0) tmpSearchParams.assignee = selectedAssignee;
        // eslint-disable-next-line eqeqeq
        if (selectedFilter != 'null') tmpSearchParams.sort = selectedFilter;
        setSearchParams(tmpSearchParams);
    };

    const getBugs = (nextPage = false) => {
        if (!nextPage) setResultStatus(2);
        const requestUrl = nextPage ? pagination.next_page_url
            : 'api/bugs?paginate=5&with=project,milestone,status,priority,difficulty,assignedTo';
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += `&title=${title}`;
        if (selectedProject > 0 && nextPage === false) requestUrlParams += `&project_id=${selectedProject}`;
        if (selectedMilestone > 0 && nextPage === false) requestUrlParams += `&milestone_id=${selectedMilestone}`;
        if (selectedAssignee > 0 && nextPage === false) requestUrlParams += `&assigned_to=${selectedAssignee}`;
        if (selectedFilter.length > 4) requestUrlParams += filterQuerys[selectedFilter];
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setBugs([...bugs, ...r.data.data]);
            else setBugs([...r.data.data]);
            setPagination(r.data);
            setResultStatus(r.data.data.length > 0 ? 1 : 0);
        });
    };

    const handleLoadMore = () => {
        getBugs(true);
    };

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data); });
    };

    const getMilestones = () => {
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data.data); });
    };

    const getUsers = () => {
        axios.getRequest('api/users', (r) => { setUsers(r.data.data); });
    };

    useEffect(() => {
        if (selectedProject || selectedMilestone || selectedAssignee || selectedFilter) {
            getBugs();
            updateSearchParams();
        }
    }, [selectedProject, selectedMilestone, selectedAssignee, selectedFilter]);

    useEffect(() => {
        if (!search) {
            getBugs();
            getProjects();
            getMilestones();
        }
        getUsers();
    }, [title]);

    const selectableMilestones = useMemo(() => {
        const filteredMilestones = [];

        if (milestones.length > 0 && selectedProject > 0) {
            milestones.forEach((milestone) => {
                // eslint-disable-next-line eqeqeq
                if (milestone.project_id == selectedProject) {
                    filteredMilestones.push(milestone);
                }
            });
        } else {
            return milestones;
        }

        return filteredMilestones;
    }, [selectedProject, projects, milestones]);

    const statusClassMap = {
        1: 'badge rounded-pill bg-primary bg-opacity-75',
        2: 'badge rounded-pill bg-warning bg-opacity-75',
        3: 'badge rounded-pill bg-info bg-opacity-75',
        4: 'badge rounded-pill bg-success bg-opacity-75',
    };

    const priorityClassMap = {
        1: 'badge bg-primary bg-opacity-75',
        2: 'badge bg-warning bg-opacity-75',
        3: 'badge bg-danger bg-opacity-75',
    };

    const difficultyClassMap = {
        1: 'badge rounded-pill bg-primary bg-opacity-75',
        2: 'badge rounded-pill bg-warning bg-opacity-75',
        3: 'badge rounded-pill bg-danger bg-opacity-75',
    };

    return (
        <div className="container">
            <div className="row mb-4 mt-1">
                {!search && (
                    <div className="col-auto">
                        <Link to="/bug">
                            <button type="button" className="btn btn-primary btn-sm" aria-label="Open Bug Form">
                                <i className="bi bi-plus fs-4" />
                            </button>
                        </Link>
                    </div>
                )}
                <div className="col-auto"><h1>Bugs</h1></div>
            </div>

            {!search && (
                <div className="row mb-5 g-3">
                    <div className="col-12 col-sm-4 col-lg-3">
                        <SelectField
                            name="selected_project"
                            value={selectedProject}
                            setValue={(e) => { setSelectedProject(e.target.value); setSelectedMilestone(null); }}
                            title="Project"
                            options={projects}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-3">
                        <SelectField
                            name="selected_milestone"
                            value={selectedMilestone}
                            setValue={(e) => { setSelectedMilestone(e.target.value); }}
                            title="Milestone"
                            options={selectableMilestones}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-3">
                        <SelectField
                            name="selected_assignee"
                            value={selectedAssignee}
                            setValue={(e) => { setSelectedAssignee(e.target.value); }}
                            title="Assignee"
                            options={users}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-3">
                        <SelectField
                            name="selected_filter"
                            value={selectedFilter}
                            setValue={(e) => { setSelectedFilter(e.target.value); }}
                            title="Sort"
                            options={filterOpts}
                        />
                    </div>
                </div>
            )}

            <AlertBox />

            {(resultStatus === 1 || resultStatus === 3) && bugs && bugs.length && (
                <div className="bugs row mb-4 g-4">
                    {bugs.map((item) => (
                        <div key={item.id} className="col-12">
                            <div className="bug__item px-3 py-3">
                                <div className="row">
                                    <div className="col-5 col-lg-4">
                                        <div className="bug__label pb-0 text-muted">Bug</div>
                                        <div className="bug__value mb-2">
                                            <Link to={`/bug/${item.id}`}>{item.title}</Link>
                                        </div>
                                        <div className="bug__label pb-0 text-muted">Project</div>
                                        <div className="bug__value mb-2">{item.project ? item.project.title : 'Not Selected'}</div>
                                        <div className="bug__label pb-0 text-muted">Milestone</div>
                                        <div className="bug__value">{item.milestone ? item.milestone.title : 'Not Selected'}</div>
                                    </div>
                                    <div className="col-3 col-lg-4">
                                        <div className="row row-cols-1 row-cols-lg-3">
                                            <div className="col">
                                                <div className="bug__label pb-0 text-muted">Status</div>
                                                {item.status && (
                                                    <div className={`bug__value fw-normal fs-6 mb-2 ${statusClassMap[item.status_id]}`}>
                                                        {item.status.title}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col">
                                                <div className="bug__lyabel pb-0 text-muted">Difficulty</div>
                                                {item.difficulty && (
                                                    <div className={`bug__value fw-normal fs-6 mb-2 ${difficultyClassMap[item.difficulty_id]}`}>
                                                        {item.difficulty.title}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col">
                                                <div className="bug__label pb-0 text-muted">Priority</div>
                                                {item.priority && (
                                                    <div className={`bug__value fw-normal fs-6 mb-2 ${priorityClassMap[item.priority_id]}`}>
                                                        {item.priority.title}
                                                    </div>
                                                )}
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
                                            {item.assigned_to && (
                                                <div className="">
                                                    <div className="">
                                                        <Avatar user={item.assigned_to} size="50" />
                                                    </div>
                                                    <div className="">{item.assigned_to.name}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {resultStatus === 0 && (
                <div className="row mb-4">
                    <h2>
                        <i className="bi bi-exclamation-diamond-fill color-util pe-2 fs-1" />
                        No Results found...
                    </h2>
                </div>
            )}
            {resultStatus > 1 && (
                <div className="loader" />
            )}

            {resultStatus < 2 && pagination.next_page_url && (
                <div className="row justify-content-center">
                    <div className="col-4 text-center">
                        <button type="button" className="btn btn-primary" onClick={handleLoadMore} aria-label="Load more bugs">
                            <i className="bi bi-chevron-compact-down fs-4 mx-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
