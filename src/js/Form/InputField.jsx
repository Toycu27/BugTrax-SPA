import React from 'react';

export default function InputField({ type = 'text', title, name, value, setValue, errorValue, required = false, disabled = false }) {
    const feedbackId = `${name}_feedback`;
    const inputId = `${name}_id`;

    return (
        <div className="form-floating">
            <input
                id={inputId}
                className={`form-control ${errorValue ? 'is-invalid' : ''}`}
                placeholder={title}
                type={type}
                name={name}
                value={value}
                onChange={setValue}
                aria-describedby={feedbackId}
                required={required}
                disabled={disabled}
            />
            <div id={feedbackId} className="invalid-feedback">
                {errorValue}
            </div>
            <label className="text-muted" htmlFor={inputId}>
                {title}
            </label>
        </div>
    );
}
