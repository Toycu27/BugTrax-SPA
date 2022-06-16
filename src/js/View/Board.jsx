import { useSearchParams } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import axios from 'axios';
import { SelectField } from '../Form';
import { BoardBug } from '../View';

export default function Board() {
    // 0 = No Result, 1 = Success, 2 = Fetch, 3 = Fetch More
    const [resultStatus, setResultStatus] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const [bugs, setBugs] = useState([]);
    const [bugsMatrix, setBugsMatrix] = useState({});

    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [users, setUsers] = useState();
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));
    const [selectedMilestone, setSelectedMilestone] = useState(searchParams.get('milestone'));
    const [selectedAssignee, setSelectedAssignee] = useState(searchParams.get('assignee'));

    const updateSearchParams = () => {
        const tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        if (selectedMilestone > 0) tmpSearchParams.milestone = selectedMilestone;
        if (selectedAssignee > 0) tmpSearchParams.assignee = selectedAssignee;
        setSearchParams(tmpSearchParams);
    };

    const getBugs = () => {
        setResultStatus(2);
        let requestUrlParams = '';
        if (selectedProject > 0) requestUrlParams += `&project_id=${selectedProject}`;
        if (selectedMilestone > 0) requestUrlParams += `&milestone_id=${selectedMilestone}`;
        if (selectedAssignee > 0) requestUrlParams += `&assigned_to=${selectedAssignee}`;
        axios.getRequest(`api/bugs?sort[priority_id]=ASC&sort[difficulty_id]=ASC&with=assignedTo${requestUrlParams}`, (r) => {
            setBugs(r.data.data);
            setResultStatus(r.data.data.length > 0 ? 1 : 0);
        });
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
        if (bugs) {
            const bugsMatrixTmp = { 1: [], 2: [], 3: [], 4: [] };
            bugs.forEach((bug) => {
                bugsMatrixTmp[bug.status_id].unshift(bug);
            });
            setBugsMatrix(bugsMatrixTmp);
        }
    }, [bugs]);

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
        New: 'bg-primary',
        Progress: 'bg-warning',
        Review: 'bg-info',
        Done: 'bg-success',
    };

    return (
        <>
            <div className="container">
                <div className="row mb-3 mt-1">
                    <div className="col-auto"><h1>Board</h1></div>
                </div>
                <div className="row mb-5 g-3">
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField
                            name="selected_project"
                            value={selectedProject}
                            setValue={(e) => { setSelectedProject(e.target.value); setSelectedMilestone(null); }}
                            title="Project"
                            options={projects}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField
                            name="selected_milestone"
                            value={selectedMilestone}
                            setValue={(e) => { setSelectedMilestone(e.target.value); }}
                            title="Milestone"
                            options={selectableMilestones}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField
                            name="selected_assignee"
                            value={selectedAssignee}
                            setValue={(e) => { setSelectedAssignee(e.target.value); }}
                            title="Assignee"
                            options={users}
                        />
                    </div>
                </div>

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
            </div>

            {(resultStatus === 1 || resultStatus === 3) && Object.keys(bugsMatrix).length > 0 && (
                <div className="container-fluid">
                    <div className="row mb-3 mt-1">
                        <div className="table-responsive-lg">
                            <table id="board" className="table text-center table-borderless table-fixed" style={{ tableLayout: 'fixed' }}>
                                <thead>
                                    <tr>
                                        <th scope="col" className={`${statusClassMap.New} bg-opacity-50`}>New</th>
                                        <th scope="col" className={`${statusClassMap.Progress} bg-opacity-50`}>Progress</th>
                                        <th scope="col" className={`${statusClassMap.Review} bg-opacity-50`}>Review</th>
                                        <th scope="col" className={`${statusClassMap.Done} bg-opacity-50`}>Done</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {bugsMatrix[1].map((bug) => <BoardBug key={bug.id} bug={bug} />)}
                                        </td>
                                        <td>
                                            {bugsMatrix[2].map((bug) => <BoardBug key={bug.id} bug={bug} />)}
                                        </td>
                                        <td>
                                            {bugsMatrix[3].map((bug) => <BoardBug key={bug.id} bug={bug} />)}
                                        </td>
                                        <td>
                                            {bugsMatrix[4].map((bug) => <BoardBug key={bug.id} bug={bug} />)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
