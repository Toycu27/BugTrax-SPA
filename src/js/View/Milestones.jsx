import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertBox, ModalBox, MilestoneForm, SelectField } from "../Form";
import axios from "axios";

export default function Milestones({user}) {
    const [ milestones, setMilestones ] = useState();
    const [ projects, setProjects ] = useState();
    const [ pagination, setPagination ] = useState([]);
    const [ selectedProject, setSelectedProject ] = useState();

    const getMilestones = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/milestones?paginate=5&with=project'
        let requestUrlParams = '';
        if (!isNaN(selectedProject) && nextPage === false) requestUrlParams += '&project_id=' + selectedProject
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
        if (selectedProject) getMilestones();
    }, [selectedProject]);

    useEffect(() => {
        getMilestones();
        getProjects();
    }, []);

    return (<>
        <div className="row">
            <div className="col-6 text-end"><h2>Milestones</h2></div>
            <div className="col-6">
                <ModalBox id="milestone_form_" buttonTitle={<i className="bi bi-plus fs-4"></i>}>
                    <MilestoneForm afterSubmit={ getMilestones }/>
                </ModalBox>
            </div>
        </div>
        <AlertBox />

        <div className="row">
            <div className="col-4">
                <SelectField name="selected_project" value={selectedProject} setValue={(e) => {setSelectedProject(e.target.value)}} title="Project" options={projects} />
            </div>
        </div>

        <div className="row">
            <table className="table table-hover table-borderless">
                <thead>
                    <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Project</th>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                    </tr>
                </thead>
                <tbody>
                    { milestones ? milestones.map(item => 
                        <tr key={item.id}>
                            <td>
                                <ModalBox id={"milestone_form_" + item.id} buttonTitle={ item.title }>
                                    <MilestoneForm id={ item.id } milestone={ item } afterSubmit={ getMilestones }/>
                                </ModalBox>
                            </td>
                            <td>{item.desc}</td>
                            <td>{ item.project.title }</td>
                            <td>{new Date(item.start_date).toLocaleDateString()}</td>
                            <td>{new Date(item.end_date).toLocaleDateString()}</td>
                        </tr>
                    ) : null }
                </tbody>
            </table>
        </div>

        { pagination.next_page_url ? 
            <div className="row justify-content-center">
                <div className="col-4 text-center">
                    <button type="button" className="btn btn-info" onClick={ handleLoadMore }>Load More</button>
                </div>
            </div> 
        : null }
    </>);
}