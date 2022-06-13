import React from 'react';
import { useParams } from 'react-router-dom';
import { Projects, Milestones, Bugs } from '../View';

export default function Search() {
    const urlParams = useParams();

    return (
        <div className="container">
            <div className="">
                <Projects search title={urlParams.input} />
            </div>
            <div className="mt-5">
                <Milestones search title={urlParams.input} />
            </div>
            <div className="mt-5">
                <Bugs search title={urlParams.input} />
            </div>
        </div>
    );
}
