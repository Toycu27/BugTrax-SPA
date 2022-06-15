/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';

export default function SelectField({ name, value, setValue, errorValue, title, options, required = false, disabled = false }) {
    const feedbackId = `${name}_feedback`;
    const inputId = `${name}_id`;
    const optionsHTML = [];
    if (value === null) value = '';

    if (Array.isArray(options)) {
        options.forEach((item) => optionsHTML.push(<option key={item.id || item} value={item.id || item}>{item.title || item.name || item}</option>));
    } else {
        /*
        Object.keys(options).forEach((item, index) => {
            // eslint-disable-next-line react/no-array-index-key
            optionsHTML.push(<option key={index} value={index}>{item}</option>);
        });
        */
        for (const key in options) {
            optionsHTML.push(<option key={key} value={key}>{options[key]}</option>);
        }
    }

    return (
        <div className="form-floating">
            <select
                id={inputId}
                className={`form-select ${errorValue ? 'is-invalid' : ''}`}
                name={name}
                value={value}
                onChange={setValue}
                aria-describedby={feedbackId}
                required={required}
                disabled={disabled}
            >
                <option key="null" value="null" aria-label="Nothing Selected" />
                {optionsHTML}
            </select>
            {errorValue && (
                <div id={feedbackId} className="invalid-feedback">
                    {errorValue}
                </div>
            )}
            <label htmlFor={inputId}>
                {title}
            </label>
        </div>
    );
}
