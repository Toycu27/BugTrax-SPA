import React from 'react';

export default function CheckboxField({ title, name, value, setValue, errorValue, required = false }) {
    const feedbackId = `${name}_feedback`;
    const inputId = `${name}_id`;

    return (
        <div className="form-check">
            <input
                id={inputId}
                className={`form-check-input ${errorValue ? 'is-invalid' : ''}`}
                type="checkbox"
                name={name}
                value={value}
                onChange={setValue}
                aria-describedby={feedbackId}
                required={required}
            />
            <label className="form-check-label" htmlFor={inputId}>
                {title}
            </label>
            <div id={feedbackId} className="invalid-feedback">
                {errorValue}
            </div>
        </div>
    );
}
