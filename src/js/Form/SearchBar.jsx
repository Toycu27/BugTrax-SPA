import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SearchBar () {
    const navigate = useNavigate();
    const [ searchInput, setSearchInput ] = useState('');

    useEffect(() => {
        const DelayDebounce = setTimeout(() => {
            if (searchInput.length > 2) {
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