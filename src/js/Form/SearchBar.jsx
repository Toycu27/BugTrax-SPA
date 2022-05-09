import React, { useState, useEffect } from "react";
import { Link, urlParams, useNavigate } from "react-router-dom";
import { InputField, AlertBox } from "../Form";

export default function SearchBar () {
    const navigate = useNavigate();
    const [ searchInput, setSearchInput ] = useState(null);

    useEffect(() => {
        const DelayDebounce = setTimeout(() => {
            if (searchInput) {
                navigate('search/' + searchInput);
            }
        }, 2000);

        return () => clearTimeout(DelayDebounce)
    }, [searchInput]);

    return (
        <form className="d-flex">
                <input autoFocus value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
                className="form-control rounded-pill" type="search" placeholder="Search..." aria-label="Search" />
        </form>
    );
}