import axios from "axios";
import { useEffect, useState } from "react";
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, Title, Tooltip, Legend, Filler, ArcElement, LinearScale,
    RadialLinearScale, PointElement, LineElement, CategoryScale, BarElement,
} from 'chart.js';

export default function Statistics() {
    const [ bugs, setBugs ] = useState();
    const [ data1a, setData1a ] = useState([]);
    const [ data1b, setData1b ] = useState([]);
    const [ data2, setData2 ] = useState([]);
    const [ data3, setData3 ] = useState([]);

    const getBugs = () => {
        axios.getRequest('api/bugs', (r) => {setBugs(r.data.data)});
    }

    useEffect(() => {
        getBugs();
    }, []);

    useEffect(() => {
        if (bugs) {
            let bugsPerPriority = [0, 0, 0, 0];
            let bugsPerDifficulty = [0, 0, 0, 0];
            let bugsPerStatus = [0, 0, 0, 0, 0];
            let bugsPerDevice = [0, 0, 0];
            let bugsPerOs = [0, 0, 0];

            bugs.map(bug => {
                switch (bug.priority) {
                    case 'Low': bugsPerPriority[0]++; break;
                    case 'Normal': bugsPerPriority[1]++; break;
                    case 'High': bugsPerPriority[2]++; break;
                    case 'Immediate': bugsPerPriority[2]++; break;
                }

                switch (bug.difficulty) {
                    case 'Easy': bugsPerDifficulty[0]++; break;
                    case 'Normal': bugsPerDifficulty[1]++; break;
                    case 'Hard': bugsPerDifficulty[2]++; break;
                    case 'Unknown': bugsPerDifficulty[2]++; break;
                }

                switch (bug.status) {
                    case 'New': bugsPerStatus[0]++; break;
                    case 'Progress': bugsPerStatus[1]++; break;
                    case 'Freeze': bugsPerStatus[2]++; break;
                    case 'Testing': bugsPerStatus[3]++; break;
                    case 'Solved': bugsPerStatus[4]++; break;
                }

                switch (bug.device_type) {
                    case 'Desktop': bugsPerDevice[0]++; break;
                    case 'Tablet': bugsPerDevice[1]++; break;
                    case 'Mobile': bugsPerDevice[2]++; break;
                }

                switch (bug.device_os) {
                    case 'Windows': bugsPerOs[0]++; break;
                    case 'Mac': bugsPerOs[1]++; break;
                    case 'Linux': bugsPerOs[2]++; break;
                }
            });

            setData1a(bugsPerPriority);
            setData1b(bugsPerDifficulty);
            setData2(bugsPerStatus);
            setData3([...bugsPerDevice, ...bugsPerOs]);
        }
    }, [bugs]);


    ChartJS.register(
        Title, Tooltip, Legend, Filler, ArcElement, LinearScale,
        RadialLinearScale, PointElement, LineElement, CategoryScale, BarElement,
    );

    return (<>
        <div className="row g-4 mb-4">
            <div className="col-8">
                <div className="p-3 bg-opacity-50 bg-light x-expand">
                    <h5 className="mb-4">Bugs per Priority and Difficulty</h5>
                    <Line data={
                        {
                            labels: ['Low/Easy', 'Normal', 'High/Hard', 'Immediate/Unknown'],
                            datasets: [
                                {
                                    label: 'Priority',
                                    data: data1a,
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    borderColor: 'rgba(255, 99, 132, 0.5)',
                                    borderWidth: 2,
                                },
                                {
                                    label: 'Difficulty',
                                    data: data1b,
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    borderColor: 'rgba(53, 162, 235, 0.5)',
                                    borderWidth: 2,
                                },
                            ],
                        }
                    } options={
                        {
                            responsive: true,
                            interaction: {
                                mode: 'index',
                                intersect: false,
                            },
                        }
                    } />
                </div>
            </div>

            <div className="col-4">
                <div className="p-3 bg-opacity-50 bg-light x-expand">
                    <h5 className="mb-4">Bugs per Status</h5>
                    <Doughnut data={
                        {
                            labels: ['New', 'Progress', 'Freeze', 'Testing', 'Solved'],
                            datasets: [
                                {
                                    label: '%',
                                    data: data2,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(75, 192, 192, 0.5)',
                                        'rgba(255, 205, 86, 0.5)',
                                        'rgba(201, 203, 207, 0.5)',
                                        'rgba(54, 162, 235, 0.5)',
                                    ],
                                    borderWidth: 0,
                                },
                            ],
                        }
                    } />
                </div>
            </div>
        </div>

        <div className="row g-4 mb-4">
            <div className="col-8">
                <div className="p-3 bg-opacity-50 bg-light x-expand">
                    <h5 className="mb-4">Client Device and Bugs</h5>
                    <Bar data={
                        {
                            labels: ['Desktop', 'Tablet', 'Mobile', 'Windows', 'MacOS', 'Linux'],
                            datasets: [
                                {
                                    label: 'Bugs',
                                    data: data3,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(53, 162, 235, 0.5)',
                                        'rgba(53, 162, 235, 0.5)',
                                        'rgba(54, 162, 235, 0.5)',
                                    ],
                                    borderWidth: 0,
                                },
                            ],
                        }
                    } options={
                        {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                        }
                    } />
                </div>
            </div>
        </div>
    </>)
}