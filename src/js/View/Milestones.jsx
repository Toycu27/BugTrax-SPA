import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertBox, SelectField } from "../Form";
import axios from "axios";

export default function Milestones({ search, title }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateSearchParams = () => {
        setSearchParams({ project: selectedProject })
    }

    const [milestones, setMilestones] = useState();
    const [projects, setProjects] = useState();
    const [pagination, setPagination] = useState([]);
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));

    const getMilestones = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/milestones?paginate=6&with=project'
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        if (selectedProject > 0 && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setMilestones([...milestones, ...r.data.data])
            else setMilestones([...r.data.data])
            setPagination(r.data)
        })
    }

    const handleLoadMore = () => {
        getMilestones(true);
    }

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data) });
    }

    useEffect(() => {
        if (selectedProject) {
            getMilestones();
            updateSearchParams();
        }
    }, [selectedProject]);

    useEffect(() => {
        getMilestones();
        getProjects();
    }, []);

    useEffect(() => {
        getMilestones();
        getProjects();
    }, [title]);

    return (<div className="container">
        <div className="row mb-4 mt-1">
            {!search ?
                <div className="col-auto">
                    <Link to="/milestone">
                        <button type="button" className="btn btn-primary btn-sm">
                            <i className="bi bi-plus fs-4"></i>
                        </button>
                    </Link>
                </div>
                : null}
            <div className="col-auto"><h2>Milestones</h2></div>
        </div>

        {!search ?
            <div className="row mb-5">
                <div className="col-12 col-sm-6 col-lg-4">
                    <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value) }} title="Project" options={projects} />
                </div>
            </div>
            : null}

        <AlertBox />

        {milestones && milestones.length ?
            <div className="milestones row mb-4 g-4">
                {milestones.map(item =>
                    <div key={item.id} className="col-12">
                        <div className="milestone__item px-3 py-2">
                            <div className="row">

                                <div className="col-6 col-md-4">
                                    <div className="milestone__label pb-0 text-muted">Milestone</div>
                                    <div className="milestone__value mb-2">
                                        <Link to={"/milestone/" + item.id}>{item.title}</Link>
                                    </div>
                                    <div className="milestone__label pb-0 text-muted">Project</div>
                                    <div className="milestone__value">{item.project ? item.project.title : "Not Selected"}</div>
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
                )}
            </div>
            : <div className="row mb-4">
                <p>No Results found...</p>
            </div>
        }

        {pagination.next_page_url ?
            <div className="row justify-content-center">
                <div className="col text-center">
                    <button type="button" className="btn btn-primary" onClick={handleLoadMore}>
                        <i className="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div>
            : null}
    </div>);
}