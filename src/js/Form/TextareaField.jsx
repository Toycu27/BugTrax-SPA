import React from 'react';

export default function TextareaField({ name, value, setValue, errorValue, title, required = false, expand = false }) {
    const feedbackId = `${name}_feedback`;
    const inputId = `${name}_id`;

    return (
        <div className="form-floating">
            <textarea
                id={inputId}
                className={`form-control ${expand ? 'expand ' : ''}${errorValue ? 'is-invalid ' : ''}`}
                placeholder={title}
                name={name}
                value={value}
                onChange={setValue}
                aria-describedby={feedbackId}
                required={required}
                style={{ height: '100px' }}
            />
            <div id={feedbackId} className="invalid-feedback">
                {errorValue}
            </div>
            <label htmlFor={inputId}>
                {title}
            </label>
        </div>
    );
}
