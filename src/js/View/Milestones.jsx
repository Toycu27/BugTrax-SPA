import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertBox, SelectField } from "../Form";
import axios from "axios";

export default function Milestones({ search, title }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateSearchParams = () => {
        let tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        if (selectedFilter != 'null') tmpSearchParams.sort = selectedFilter;
        setSearchParams(tmpSearchParams);
    }

    const [milestones, setMilestones] = useState();
    const [projects, setProjects] = useState();
    const [pagination, setPagination] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const filterOpts = {
        'start_asc': 'Start ASC',
        'start_desc': 'Start DESC',
        'end_asc': 'End ASC',
        'end_desc': 'End DESC',
    };
    const filterQuerys = {
        'start_asc': '&sort[start_date]=ASC',
        'start_desc': '&sort[start_date]=DESC',
        'end_asc': '&sort[end_date]=ASC',
        'end_desc': '&sort[end_date]=DESC',
    }
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));

    const getMilestones = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/milestones?paginate=6&with=project';
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        if (selectedProject > 0 && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
        if (selectedFilter.length > 4) requestUrlParams += filterQuerys[selectedFilter];
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
        if (selectedProject || selectedFilter) {
            getMilestones();
            updateSearchParams();
        }
    }, [selectedProject, selectedFilter]);

    useEffect(() => {
        getMilestones();
        getProjects();
    }, [title]);

    return (<div className="container">
        <div className="row mb-4 mt-1">
            {!search &&
                <div className="col-auto">
                    <Link to="/milestone">
                        <button type="button" className="btn btn-primary btn-sm" aria-label="Open Milestone Form">
                            <i className="bi bi-plus fs-4"></i>
                        </button>
                    </Link>
                </div>
            }
            <div className="col-auto"><h2>Milestones</h2></div>
        </div>

        {!search &&
            <div className="row mb-5 g-3">
                <div className="col-12 col-sm-6 col-lg-3">
                    <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value) }} title="Project" options={projects} />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <SelectField name="selected_filter" value={selectedFilter} setValue={(e) => { setSelectedFilter(e.target.value) }} title="Sort" options={filterOpts} />
                </div>
            </div>
        }

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

        {pagination.next_page_url &&
            <div className="row justify-content-center">
                <div className="col text-center">
                    <button type="button" className="btn btn-primary" onClick={handleLoadMore} aria-label="Load more milestones">
                        <i className="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div>
        }
    </div>);
}