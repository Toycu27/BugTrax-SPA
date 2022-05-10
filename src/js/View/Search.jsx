import React from "react";
import { useParams } from "react-router-dom";
import { Projects, Milestones, Bugs } from "./";

export default function Search() {
    let urlParams = useParams();

    return (<>
        <div className="">
            <Projects search={true} title={urlParams.input} />
        </div>
        <div className="mt-5">
            <Milestones search={true} title={urlParams.input} />
        </div>
        <div className="mt-5">
            <Bugs search={true} title={urlParams.input} />
        </div>
    </>);
}