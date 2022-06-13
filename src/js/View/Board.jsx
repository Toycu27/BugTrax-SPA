import { useSearchParams } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { SelectField } from '../Form';
import { BoardBug } from '../View';
import axios from "axios";

export default function Board() {
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
        let tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        if (selectedMilestone > 0) tmpSearchParams.milestone = selectedMilestone;
        if (selectedAssignee > 0) tmpSearchParams.assignee = selectedAssignee;
        setSearchParams(tmpSearchParams);
    }

    const getBugs = () => {
        let requestUrlParams = '';
        if (selectedProject > 0) requestUrlParams += '&project_id=' + selectedProject
        if (selectedMilestone > 0) requestUrlParams += '&milestone_id=' + selectedMilestone
        if (selectedAssignee > 0) requestUrlParams += '&assigned_to=' + selectedAssignee
        axios.getRequest('api/bugs?sort[priority_id]=ASC&sort[difficulty_id]=ASC&with=assignedTo' + requestUrlParams, (r) => {
            setBugs(r.data.data)
        })
    }

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data) });
    }

    const getMilestones = () => {
        axios.getRequest('api/milestones', (r) => { setMilestones(r.data.data) });
    }

    const getUsers = () => {
        axios.getRequest('api/users', (r) => { setUsers(r.data.data) });
    }

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
            let bugsMatrixTmp = { 1: [], 2: [], 3: [], 4: [] };
            bugs.map(bug => {
                bugsMatrixTmp[bug.status_id].unshift(bug);
            });
            setBugsMatrix(bugsMatrixTmp);
        }
    }, [bugs]);

    const selectableMilestones = useMemo(() => {
        let filteredMilestones = [];


        if (milestones.length > 0 && selectedProject > 0) {
            milestones.forEach(milestone => {
                if (milestone.project_id == selectedProject) {
                    filteredMilestones.push(milestone);
                }
            });
        } else {
            return milestones;
        }

        return filteredMilestones;
    }, [selectedProject, projects, milestones]);

    let statusClassMap = {
        'New': 'bg-primary bg-opacity-25',
        'Progress': 'bg-warning bg-opacity-25',
        'Review': 'bg-info bg-opacity-25',
        'Done': 'bg-success bg-opacity-25',
    };

    if (Object.keys(bugsMatrix).length > 0) {
        return (<>
            <div className="container">
                <div className="row mb-4 mt-1">
                    <div className="col-auto"><h1>Board</h1></div>
                </div>
                <div className="row mb-5 g-3">
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value); setSelectedMilestone(null) }} title="Project" options={projects} />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField name="selected_milestone" value={selectedMilestone} setValue={(e) => { setSelectedMilestone(e.target.value) }} title="Milestone" options={selectableMilestones} />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField name="selected_assignee" value={selectedAssignee} setValue={(e) => { setSelectedAssignee(e.target.value) }} title="Assignee" options={users} />
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row mb-4 mt-1">
                    <div className="table-responsive-lg">
                        <table id="board" className="table text-center table-borderless table-fixed" style={{tableLayout: "fixed"}}>
                            <thead>
                                <tr>
                                    <th scope="col" className={statusClassMap.New}>New</th>
                                    <th scope="col" className={statusClassMap.Progress}>Progress</th>
                                    <th scope="col" className={statusClassMap.Review}>Review</th>
                                    <th scope="col" className={statusClassMap.Done}>Done</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{bugsMatrix[1].map(bug => <BoardBug key={bug.id} bug={bug} />)}</td>
                                    <td>{bugsMatrix[2].map(bug => <BoardBug key={bug.id} bug={bug} />)}</td>
                                    <td>{bugsMatrix[3].map(bug => <BoardBug key={bug.id} bug={bug} />)}</td>
                                    <td>{bugsMatrix[4].map(bug => <BoardBug key={bug.id} bug={bug} />)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>)
    } else return (<div className="container">Loading Data...</div>);
}