import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertBox } from '../Form';
import { LoadMoreButton } from '../View';

export default function Projects({ search, title }) {
    // 0 = No Result, 1 = Success, 2 = Fetch, 3 = Fetch More
    const [resultStatus, setResultStatus] = useState(0);
    const [projects, setProjects] = useState();
    const [pagination, setPagination] = useState([]);

    const getProjects = (nextPage = false) => {
        if (!nextPage) setResultStatus(2);
        const requestUrl = nextPage ? pagination.next_page_url : 'api/projects?paginate=6';
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += `&title=${title}`;
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setProjects([...projects, ...r.data.data]);
            else setProjects([...r.data.data]);
            setPagination(r.data);
            setResultStatus(r.data.data.length > 0 ? 1 : 0);
        });
    };

    const handleLoadMore = () => {
        getProjects(true);
    };

    useEffect(() => {
        getProjects();
    }, [title]);

    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                {!search && (
                    <div className="col-auto">
                        <Link to="/project">
                            <button type="button" className="btn btn-primary btn-sm" aria-label="Open Project Form">
                                <i className="bi bi-plus fs-4" />
                            </button>
                        </Link>
                    </div>
                )}
                <div className="col-auto"><h1>Projects</h1></div>
            </div>

            <AlertBox />

            {(resultStatus === 1 || resultStatus === 3) && projects && projects.length && (
                <div className="projs row mb-4 g-3">
                    {projects.map((item) => (
                        <div key={item.id} className="col-12 col-lg-6">
                            <div className="proj__item px-3 py-3 x-expand">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="proj__label pb-0 text-muted">Project</div>
                                        <div className="proj__value mb-2">
                                            <Link to={`/project/${item.id}`}>{item.title}</Link>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="proj__label pb-0 text-muted">Created</div>
                                        <div className="proj__value">{new Date(item.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="col-3">
                                        <div className="proj__label pb-0 text-muted">Modified</div>
                                        <div className="proj__value">{new Date(item.updated_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="proj__label pb-0 text-muted">Description</div>
                                        <div className="proj__value">{item.desc}</div>
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
                <LoadMoreButton onClick={handleLoadMore} title="Load more projects" />
            )}
        </div>
    );
}
