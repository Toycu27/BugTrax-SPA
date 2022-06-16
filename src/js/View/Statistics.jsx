import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, Title, Tooltip, Legend, Filler, ArcElement, LinearScale,
    RadialLinearScale, PointElement, LineElement, CategoryScale, BarElement,
} from 'chart.js';
import { useSearchParams } from 'react-router-dom';
import { SelectField } from '../Form';

export default function Statistics() {
    const [projects, setProjects] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedProject, setSelectedProject] = useState(searchParams.get('project'));

    const [bugs, setBugs] = useState();
    const [data0Labels, setData0Labels] = useState([]);
    const [data0a, setData0a] = useState([]);
    const [data0b, setData0b] = useState([]);
    const [data0c, setData0c] = useState([]);
    const [data1a, setData1a] = useState([]);
    const [data1b, setData1b] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);

    const updateSearchParams = () => {
        const tmpSearchParams = {};
        if (selectedProject > 0) tmpSearchParams.project = selectedProject;
        setSearchParams(tmpSearchParams);
    };

    const getBugs = () => {
        let requestUrlParams = '';
        if (selectedProject > 0) requestUrlParams += `?project_id=${selectedProject}`;
        axios.getRequest(`api/bugs${requestUrlParams}`, (r) => { setBugs(r.data.data); });
    };

    const getProjects = () => {
        axios.getRequest('api/projects', (r) => { setProjects(r.data.data); });
    };

    useEffect(() => {
        getBugs();
        getProjects();
        updateSearchParams();
    }, [selectedProject]);

    function getWeekNumber(date = new Date()) {
        const startDate = new Date(date.getFullYear(), 0, 1);
        const daysInYear = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));

        return Math.ceil(daysInYear / 7);
    }

    useEffect(() => {
        if (bugs) {
            const weekLabels = [];
            const currentWeek = getWeekNumber();
            let startWeek = currentWeek - 8;
            const endWeek = currentWeek + 2;
            while (startWeek <= endWeek) {
                weekLabels.push(startWeek);
                startWeek++;
            }
            setData0Labels(weekLabels);

            const bugsCreated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const bugsModified = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const bugsDeadline = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const bugsPerPriority = [0, 0, 0];
            const bugsPerDifficulty = [0, 0, 0];
            const bugsPerStatus = [0, 0, 0, 0];
            const bugsPerDevice = [0, 0, 0];
            const bugsPerOs = [0, 0, 0];

            bugs.forEach((bug) => {
                if (bug.created_at) {
                    const tmpWeek = getWeekNumber(new Date(bug.created_at));
                    bugsCreated[tmpWeek - (currentWeek - 8)]++;
                }
                if (bug.updated_at && (bug.created_at !== bug.updated_at)) {
                    const tmpWeek = getWeekNumber(new Date(bug.updated_at));
                    bugsModified[tmpWeek - (currentWeek - 8)]++;
                }
                if (bug.end_date) {
                    const tmpWeek = getWeekNumber(new Date(bug.end_date));
                    bugsDeadline[tmpWeek - (currentWeek - 8)]++;
                }

                bugsPerPriority[bug.priority_id - 1]++;
                bugsPerDifficulty[bug.difficulty_id - 1]++;
                bugsPerStatus[bug.status_id - 1]++;

                switch (bug.device_type) {
                    case 'Desktop': bugsPerDevice[0]++; break;
                    case 'Tablet': bugsPerDevice[1]++; break;
                    case 'Mobile': bugsPerDevice[2]++; break;
                    default: break;
                }

                switch (bug.device_os) {
                    case 'Windows': bugsPerOs[0]++; break;
                    case 'Mac': bugsPerOs[1]++; break;
                    case 'Linux': bugsPerOs[2]++; break;
                    default: break;
                }
            });
            setData0a(bugsCreated);
            setData0b(bugsModified);
            setData0c(bugsDeadline);
            setData1a(bugsPerPriority);
            setData1b(bugsPerDifficulty);
            setData2(bugsPerStatus);
            setData3([...bugsPerDevice, ...bugsPerOs]);
        }
    }, [bugs]);

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        Filler,
        ArcElement,
        LinearScale,
        RadialLinearScale,
        PointElement,
        LineElement,
        CategoryScale,
        BarElement,
    );

    const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-secondary');

    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                <div className="col-auto"><h1>Statistics</h1></div>
            </div>

            <div className="row mb-5 g-3">
                <div className="col-12 col-sm-6 col-lg-3">
                    <SelectField
                        name="selected_project"
                        value={selectedProject}
                        setValue={(e) => { setSelectedProject(e.target.value); }}
                        title="Project"
                        options={projects}
                    />
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="statistic__item p-3 x-expand">
                        <span className="fw-normal mb-4 fs-5">Bugs per Kalendar Week</span>
                        <Line
                            data={
                                {
                                    labels: data0Labels,
                                    datasets: [
                                        {
                                            label: 'Created',
                                            data: data0a,
                                            backgroundColor: 'rgba(53, 162, 235, 0.75)',
                                            borderColor: 'rgba(53, 162, 235, 0.75)',
                                            borderWidth: 2,
                                        },
                                        {
                                            label: 'Modified',
                                            data: data0b,
                                            backgroundColor: 'rgba(255, 193, 6, 0.75)',
                                            borderColor: 'rgba(255, 193, 6, 0.75)',
                                            borderWidth: 2,
                                        },
                                        {
                                            label: 'Deadline',
                                            data: data0c,
                                            backgroundColor: 'rgba(255, 99, 132, 0.75)',
                                            borderColor: 'rgba(255, 99, 132, 0.75)',
                                            borderWidth: 2,
                                        },
                                    ],
                                }
                            }
                            options={
                                {
                                    color: textColor,
                                    responsive: true,
                                    interaction: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    scales: {
                                        y: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                        x: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                    },
                                }
                            }
                        />
                    </div>
                </div>

                <div className="col-8 col-lg-4">
                    <div className="statistic__item p-3 x-expand">
                        <span className="fw-normal mb-4 fs-5">Bugs per Status</span>
                        <Doughnut
                            data={
                                {
                                    labels: ['New', 'Progress', 'Review', 'Done'],
                                    datasets: [
                                        {
                                            label: '%',
                                            data: data2,
                                            backgroundColor: [
                                                'rgba(13, 110, 253, 0.75)',
                                                'rgba(255, 193, 6, 0.75)',
                                                'rgba(10, 202, 240, 0.75)',
                                                'rgba(25, 135, 84, 0.75)',
                                            ],
                                            borderWidth: 0,
                                        },
                                    ],
                                }
                            }
                            options={
                                {
                                    color: textColor,
                                }
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-6">
                    <div className="statistic__item p-3 x-expand">
                        <span className="fw-normal mb-4 fs-5">Bugs per Client Device and OS</span>
                        <Bar
                            data={
                                {
                                    labels: ['Desktop', 'Tablet', 'Mobile', 'Windows', 'MacOS', 'Linux'],
                                    datasets: [
                                        {
                                            label: 'Bugs',
                                            data: data3,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.75)',
                                                'rgba(255, 99, 132, 0.75)',
                                                'rgba(255, 99, 132, 0.75)',
                                                'rgba(53, 162, 235, 0.75)',
                                                'rgba(53, 162, 235, 0.75)',
                                                'rgba(54, 162, 235, 0.75)',
                                            ],
                                            borderWidth: 0,
                                        },
                                    ],
                                }
                            }
                            options={
                                {
                                    color: textColor,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                        x: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                    },
                                }
                            }
                        />
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="statistic__item p-3 x-expand">
                        <span className="fw-normal mb-4 fs-5">Bugs per Priority and Difficulty</span>
                        <Line
                            data={
                                {
                                    labels: ['Low/Easy', 'Medium/Normal', 'High/Hard'],
                                    datasets: [
                                        {
                                            label: 'Priority',
                                            data: data1a,
                                            backgroundColor: 'rgba(255, 99, 132, 0.75)',
                                            borderColor: 'rgba(255, 99, 132, 0.75)',
                                            borderWidth: 2,
                                        },
                                        {
                                            label: 'Difficulty',
                                            data: data1b,
                                            backgroundColor: 'rgba(53, 162, 235, 0.75)',
                                            borderColor: 'rgba(53, 162, 235, 0.75)',
                                            borderWidth: 2,
                                        },
                                    ],
                                }
                            }
                            options={
                                {
                                    color: textColor,
                                    responsive: true,
                                    interaction: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                    scales: {
                                        y: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                        x: {
                                            ticks: { color: textColor, beginAtZero: true },
                                        },
                                    },
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
