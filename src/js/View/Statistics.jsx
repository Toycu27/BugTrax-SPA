import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, Title, Tooltip, Legend, Filler, ArcElement, LinearScale,
    RadialLinearScale, PointElement, LineElement, CategoryScale, BarElement,
} from 'chart.js';

export default function Statistics() {
    const [bugs, setBugs] = useState();
    const [data1a, setData1a] = useState([]);
    const [data1b, setData1b] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);

    const getBugs = () => {
        axios.getRequest('api/bugs', (r) => { setBugs(r.data.data); });
    };

    useEffect(() => {
        getBugs();
    }, []);

    useEffect(() => {
        if (bugs) {
            const bugsPerPriority = [0, 0, 0];
            const bugsPerDifficulty = [0, 0, 0];
            const bugsPerStatus = [0, 0, 0, 0];
            const bugsPerDevice = [0, 0, 0];
            const bugsPerOs = [0, 0, 0];

            bugs.forEach((bug) => {
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
            <div className="row mb-4 mt-1">
                <div className="col-auto"><h1>Statistics</h1></div>
            </div>
            <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
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
                <div className="col-12 col-lg-8">
                    <div className="statistic__item p-3 x-expand">
                        <span className="fw-normal mb-4 fs-5">Client Device and Bugs</span>
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
            </div>
        </div>
    );
}
