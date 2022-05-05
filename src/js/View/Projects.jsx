import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AlertBox, ModalBox, ProjectForm } from "../Form";
import axios from "axios";

export default function Projects({user}) {
    const [ projects, setProjects ] = useState();
    const [ pagination, setPagination ] = useState([]);

    const getProjects = (nextPage = false) => {
        let requestUrl = nextPage ? pagination.next_page_url : 'api/projects?paginate=5'
        axios.getRequest(requestUrl, (r) => {
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

    return (<>
        <div className="row">
            <div className="col-6 text-end"><h2>Projects</h2></div>
            <div className="col-6">
                <ModalBox id="project_form_" buttonTitle={<i className="bi bi-plus fs-4"></i>}>
                    <ProjectForm afterSubmit={ getProjects }/>
                </ModalBox>
            </div>
        </div>
        <AlertBox />
        <div className="row">
            <table className="table table-hover table-borderless">
                <thead>
                    <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    { projects ? projects.map(item => 
                        <tr key={item.id}>
                            <td>
                                <ModalBox id={"project_form_" + item.id} buttonTitle={ item.title }>
                                    <ProjectForm id={ item.id } project={ item } afterSubmit={ getProjects }/>
                                </ModalBox>
                            </td>
                            <td>{item.desc}</td>
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