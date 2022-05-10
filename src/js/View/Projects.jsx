import React, { useEffect, useState } from "react";
import { AlertBox, ModalBox, ProjectForm } from "../Form";
import axios from "axios";

export default function Projects({search, title}) {
    const [ projects, setProjects ] = useState();
    const [ pagination, setPagination ] = useState([]);

    const getProjects = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/projects?paginate=6'
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setProjects([ ...projects, ...r.data.data  ])
            else setProjects([ ...r.data.data ])
            setPagination(r.data)
        });
    }

    const handleLoadMore = () => {
        getProjects(true);
    }

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        getProjects();
    }, [title]);

    return (<>
        <div className="row mb-4 mt-1">
            { !search ?
            <div className="col-auto">
                <ModalBox id="project_form_" buttonTitle={<i className="bi bi-plus fs-4"></i>}>
                    <ProjectForm afterSubmit={ getProjects }/>
                </ModalBox>
            </div>
            : null }
            <div className="col-auto"><h2>Projects</h2></div>
        </div>

        <AlertBox />

        { projects && projects.length ?
        <div className="projs row mb-4 g-4">
            { projects.map(item => 
                <div key={item.id} className="col-6">
                    <div className="proj__item px-3 py-2">
                        <div className="row">
                            <div className="col-6">
                                <div className="proj__label pb-0 text-muted">Project</div>
                                <div className="proj__value mb-2">
                                    <ModalBox id={"project_form_" + item.id} buttonStyle="link" buttonTitle={ item.title }>
                                        <ProjectForm id={ item.id } project={ item } afterSubmit={ getProjects }/>
                                    </ModalBox>
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
                                <div className="proj__value">{ item.desc }</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        : <div className="row mb-4">
            <h4>No Results found...</h4>
        </div> }

        { pagination.next_page_url ? 
            <div className="row justify-content-center">
                <div className="col-4 text-center">
                    <button type="button" className="btn btn-primary" onClick={ handleLoadMore }>
                        <i class="bi bi-chevron-compact-down fs-4 mx-5"></i>
                    </button>
                </div>
            </div> 
        : null }
    </>);
}