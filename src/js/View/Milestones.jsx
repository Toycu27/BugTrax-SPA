import { Link, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertBox, SelectField } from '../Form';

export default function Milestones({ search, title }) {
    // 0 = Fetching, 1 = Success, 2 = No Result, 3 = Fetch Next Page
    const [resultStatus, setResultStatus] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [milestones, setMilestones] = useState();
    const [projects, setProjects] = useState();
    const [pagination, setPagination] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const filterOpts = {
        start_asc: 'Start ASC',
        start_desc: 'Start DESC',
        end_asc: 'End ASC',
        end_desc: 'End DESC',
    };
    const filterQuerys = {
        start_asc: '&sort[start_date]=ASC',
        start_desc: '&sort[start_date]=DESC',
        end_asc: '&sort[end_date]=ASC',
        end_desc: '&sort[end_date]=DESC',
    };
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));

    const updateSearchParams = () => {
        const tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        // eslint-disable-next-line eqeqeq
        if (selectedFilter != 'null') tmpSearchParams.sort = selectedFilter;
        setSearchParams(tmpSearchParams);
    };

    const getMilestones = (nextPage = false) => {
        if (!nextPage) setResultStatus(2);
        const requestUrl = nextPage ? pagination.next_page_url : 'api/milestones?paginate=6&with=project';
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += `&title=${title}`;
        if (selectedProject > 0 && nextPage === false) requestUrlParams += `&project_id=${selectedProject}`;
        if (selectedFilter.length > 4) requestUrlParams += filterQuerys[selectedFilter];
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setMilestones([...milestones, ...r.data.data]);
            else setMilestones([...r.data.data]);
            setPagination(r.data);
            setResultStatus(r.data.data.length > 0 ? 1 : 0);
        });
    };

    const handleLoadMore = () => {
        getMilestones(true);
    };

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data); });
    };

    useEffect(() => {
        if (selectedProject || selectedFilter) {
            getMilestones();
            updateSearchParams();
        }
    }, [selectedProject, selectedFilter]);

    useEffect(() => {
        getMilestones();
        getProjects();
    }, [title]);

    return (
        <div className="container">
            <div className="row mb-4 mt-1">
                {!search && (
                    <div className="col-auto">
                        <Link to="/milestone">
                            <button type="button" className="btn btn-primary btn-sm" aria-label="Open Milestone Form">
                                <i className="bi bi-plus fs-4" />
                            </button>
                        </Link>
                    </div>
                )}
                <div className="col-auto"><h2>Milestones</h2></div>
            </div>

            {!search && (
                <div className="row mb-5 g-3">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <SelectField
                            name="selected_project"
                            value={selectedProject}
                            setValue={(e) => { setSelectedProject(e.target.value); }}
                            title="Project"
                            options={projects}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
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

            {(resultStatus === 1 || resultStatus === 3) && milestones && milestones.length && (
                <div className="milestones row mb-4 g-4">
                    {milestones.map((item) => (
                        <div key={item.id} className="col-12">
                            <div className="milestone__item px-3 py-3">
                                <div className="row">

                                    <div className="col-6 col-md-4">
                                        <div className="milestone__label pb-0 text-muted">Milestone</div>
                                        <div className="milestone__value mb-2">
                                            <Link to={`/milestone/${item.id}`}>{item.title}</Link>
                                        </div>
                                        <div className="milestone__label pb-0 text-muted">Project</div>
                                        <div className="milestone__value">{item.project ? item.project.title : 'Not Selected'}</div>
                                    </div>

                                    <div className="col-6 col-md-8">
                                        <div className="row row-cols-2 row-cols-md-4 g-2">
                                            <div className="col">
                                                <div className="proj__label pb-0 text-muted">Created</div>
                                                <div className="proj__value">{new Date(item.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="col">
                                                <div className="proj__label pb-0 text-muted">Modified</div>
                                                <div className="proj__value">{new Date(item.updated_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="col">
                                                <div className="milestone__label pb-0 text-muted">Start</div>
                                                <div className="milestone__value">{new Date(item.start_date).toLocaleDateString()}</div>
                                            </div>
                                            <div className="col">
                                                <div className="milestone__label pb-0 text-muted">Deadline</div>
                                                <div className="milestone__value">{new Date(item.end_date).toLocaleDateString()}</div>
                                            </div>
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
                    <div className="col text-center">
                        <button type="button" className="btn btn-primary" onClick={handleLoadMore} aria-label="Load more milestones">
                            <i className="bi bi-chevron-compact-down fs-4 mx-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
