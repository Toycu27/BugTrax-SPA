import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BoardBug } from '../View';
import { SelectField } from '../Form';
import axios from "axios";

export default function Board() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [bugs, setBugs] = useState();
    const [bugsMatrix, setBugsMatrix] = useState({});

    const [projects, setProjects] = useState();
    const [milestones, setMilestones] = useState();
    const [users, setUsers] = useState();
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));
    const [selectedMilestone, setSelectedMilestone] = useState(searchParams.get('milestone'));
    const [selectedAssignee, setSelectedAssignee] = useState(searchParams.get('assignee'));

    const updateSearchParams = () => {
        setSearchParams({ project: selectedProject, milestone: selectedMilestone, assignee: selectedAssignee })
    }
    /*
    const [collapsedCols, setCollapsedCols] = useState({
        'New': true,
        'Progress': false,
        'Freeze': false,
        'Testing': false,
        'Done': true,
    });
    */

    const getBugs = () => {
        let requestUrlParams = '';
        if (selectedProject > 0) requestUrlParams += '&project_id=' + selectedProject
        if (selectedMilestone > 0) requestUrlParams += '&milestone_id=' + selectedMilestone
        if (selectedAssignee > 0) requestUrlParams += '&assigned_to=' + selectedAssignee
        axios.getRequest('api/bugs?with=assignedTo' + requestUrlParams, (r) => {
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
            let bugsMatrixTmp = {
                'High': { 'New': [], 'Progress': [], 'Freeze': [], 'Testing': [], 'Done': [] },
                'Normal': { 'New': [], 'Progress': [], 'Freeze': [], 'Testing': [], 'Done': [] },
                'Low': { 'New': [], 'Progress': [], 'Freeze': [], 'Testing': [], 'Done': [] },
            };
            bugs.map(bug => {
                bugsMatrixTmp[bug.priority][bug.status].unshift(bug);
            });
            setBugsMatrix(bugsMatrixTmp);
        }
    }, [bugs]);

    let statusClassMap = {
        'New': 'bg-primary bg-opacity-25',
        'Progress': 'bg-warning bg-opacity-25',
        'Freeze': 'bg-dark bg-opacity-25',
        'Testing': 'bg-info bg-opacity-25',
        'Done': 'bg-success bg-opacity-25',
    };

    let priorityClassMap = {
        'Low': 'bg-primary bg-opacity-25 fw-normal',
        'Normal': 'bg-warning bg-opacity-25 fw-normal',
        'High': 'bg-danger bg-opacity-25 fw-normal',
    };

    if (Object.keys(bugsMatrix).length > 0) {
        return (<>
            <div className="container">
                <div className="row mb-4 mt-1">
                    <div className="col-auto"><h2>Board</h2></div>
                </div>
                <div className="row mb-5 gy-2">
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField name="selected_project" value={selectedProject} setValue={(e) => { setSelectedProject(e.target.value) }} title="Project" options={projects} />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4">
                        <SelectField name="selected_milestone" value={selectedMilestone} setValue={(e) => { setSelectedMilestone(e.target.value) }} title="Milestone" options={milestones} />
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
                                    <th scope="col" className={statusClassMap.Freeze}>Freeze</th>
                                    <th scope="col" className={statusClassMap.Testing}>Testing</th>
                                    <th scope="col" className={statusClassMap.Done}>Done</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th colSpan="5" scope="row" className={priorityClassMap.High}>High</th>
                                </tr>
                                <tr>
                                    <td>{bugsMatrix.High.New.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.High.Progress.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.High.Freeze.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.High.Testing.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.High.Done.map(bug => <BoardBug bug={bug} />)}</td>
                                </tr>

                                <tr>
                                    <th colSpan="5" scope="row" className={priorityClassMap.Normal}>Normal</th>
                                </tr>
                                <tr>
                                    <td>{bugsMatrix.Normal.New.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Normal.Progress.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Normal.Freeze.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Normal.Testing.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Normal.Done.map(bug => <BoardBug bug={bug} />)}</td>
                                </tr>

                                <tr>
                                    <th colSpan="5" scope="row" className={priorityClassMap.Low}>Low</th>
                                </tr>
                                <tr>
                                    <td>{bugsMatrix.Low.New.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Low.Progress.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Low.Freeze.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Low.Testing.map(bug => <BoardBug bug={bug} />)}</td>
                                    <td>{bugsMatrix.Low.Done.map(bug => <BoardBug bug={bug} />)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>)
    } else return (<div className="container">Loading Data...</div>);
}