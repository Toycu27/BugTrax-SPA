import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertBox, ModalBox, MilestoneForm, SelectField } from "../Form";
import axios from "axios";

export default function Milestones({search, title}) {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const updateSearchParams = () => {
        setSearchParams({ project: selectedProject })
    }

    const [ milestones, setMilestones ] = useState();
    const [ projects, setProjects ] = useState();
    const [ pagination, setPagination ] = useState([]);
    const [ selectedProject, setSelectedProject ] = useState(searchParams.get('project'));

    const getMilestones = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/milestones?paginate=6&with=project'
        let requestUrlParams = '';
        if (title && nextPage === false) requestUrlParams += '&title=' + title
        if (selectedProject > 0 && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
        axios.getRequest(requestUrl + requestUrlParams, (r) => {
            if (nextPage) setMilestones([ ...milestones, ...r.data.data  ])
            else setMilestones([ ...r.data.data ])
            setPagination(r.data)
        })
    }

    const handleLoadMore = () => {
        getMilestones(true);
    }

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => {setProjects(r.data.data)});
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

    return (<>
        <div className="row mb-4 mt-1">
            { !search ?
            <div className="col-auto">
                <ModalBox id="milestone_form_" buttonTitle={<i className="bi bi-plus fs-4"></i>}>
                    <MilestoneForm afterSubmit={ getMilestones }/>
                </ModalBox>
            </div>
            : null }
            <div className="col-auto"><h2>Milestones</h2></div>
        </div>

        { !search ?
        <div className="row mb-5">
            <div className="col-4">
                <SelectField name="selected_project" value={selectedProject} setValue={(e) => {setSelectedProject(e.target.value)}} title="Project" options={projects} />
            </div>
        </div>
        : null }

        <AlertBox />

        { milestones && milestones.length ?
        <div className="milestones row mb-4 g-4">
            { milestones.map(item => 
            <div key={item.id} className="col-12">
                <div className="milestone__item px-3 py-2">
                    <div className="row">
                        <div className="col-4">
                            <div className="milestone__label pb-0 text-muted">Milestone</div>
                            <div className="milestone__value mb-2">
                                <ModalBox id={"milestone_form_" + item.id} buttonStyle="link" buttonTitle={ item.title }>
                                    <MilestoneForm id={ item.id } milestone={ item } afterSubmit={ getMilestones }/>
                                </ModalBox>
                            </div>
                            <div className="milestone__label pb-0 text-muted">Project</div>
                            <div className="milestone__value">{ item.project ? item.project.title : "Not Selected"}</div>
                        </div>
                        <div className="col-2">
                            <div className="proj__label pb-0 text-muted">Created</div>
                            <div className="proj__value">{new Date(item.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="col-2">
                            <div className="proj__label pb-0 text-muted">Modified</div>
                            <div className="proj__value">{new Date(item.updated_at).toLocaleDateString()}</div>
                        </div>
                        <div className="col-2">
                            <div className="milestone__label pb-0 text-muted">Start</div>
                            <div className="milestone__value">{new Date(item.start_date).toLocaleDateString()}</div>
                        </div>
                        <div className="col-2">
                            <div className="milestone__label pb-0 text-muted">Due</div>
                            <div className="milestone__value">{new Date(item.end_date).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
        : <div className="row mb-4">
            <h4>No Results found...</h4>
        </div>
        }

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