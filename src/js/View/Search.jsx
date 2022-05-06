import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Projects, Milestones, Bugs } from "./";

export default function Search() {
    let urlParams = useParams();

    return (<>
        <Projects search={true} title={urlParams.input} />
        <Milestones search={true} title={urlParams.input} />
        <Bugs search={true} title={urlParams.input} />
    </>);
}