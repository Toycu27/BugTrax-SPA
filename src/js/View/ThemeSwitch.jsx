/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../Auth';

export default function ThemeSwitch() {
    const GLOBALS = useContext(GlobalContext);

    const [mode, setMode] = useState(GLOBALS.getThemeMode());

    const handleClick = () => {
        GLOBALS.setThemeMode(mode === 'dark' ? 'light' : 'dark');
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    }, [mode]);

    return (
        <button
            type="button"
            onClick={handleClick}
            className="theme-switch fs-6"
        >
            <div className={`theme-switch__toggle ${mode === 'dark' ? 'theme-switch__toggle--dark' : 'theme-switch__toggle--light'}`} />
            <i className="bi bi-sun-fill text-white" />
            <span className="mx-1"> </span>
            <i className="bi bi-moon-stars-fill text-white" />
        </button>
    );
}
