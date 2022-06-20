import React from 'react';

export default function LoadMoreButton({ title, onClick }) {
    return (
        <div className="row justify-content-center">
            <div className="col text-center">
                <button type="button" className="btn btn-primary" onClick={onClick} aria-label={title}>
                    <i className="bi bi-chevron-compact-down fs-4 mx-5" />
                </button>
            </div>
        </div>
    );
}
