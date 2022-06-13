import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../View';

export default function BoardBug({ bug }) {
    const difficultyIconMap = {
        1: 'bi bi-arrow-down-right text-primary fs-4',
        2: 'bi bi-arrow-right text-warning fs-4',
        3: 'bi bi-arrow-up-right text-danger fs-4',
    };

    const priorityIconMap = {
        1: 'bi bi-chevron-compact-down text-primary fs-4',
        2: 'bi bi-dash-lg text-warning fs-4',
        3: 'bi bi-chevron-compact-up text-danger fs-4',
    };

    return (
        <div className="board__bug bg-light bg-opacity-50 p-2 pt-1 mb-2 text-start">
            <div className="row gx-1">
                <div className="col-auto">
                    <div className="bug__value">
                        <i className="bi bi-hash fs-5" />
                        {bug.id}
                    </div>
                </div>
                <div className="col text-end pt-1">
                    <div className="bug__value">{new Date(bug.end_date).toLocaleDateString()}</div>
                </div>
                <div className="col-auto text-end ms-1">
                    <div className="bug__value"><i className={priorityIconMap[bug.priority_id]} /></div>
                </div>
                <div className="col-auto text-end ms-1">
                    <div className="bug__value"><i className={difficultyIconMap[bug.difficulty_id]} /></div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="bug__value">
                        <Link to={`/bug/${bug.id}`}>{bug.title}</Link>
                    </div>
                </div>

                <div className="col-auto">
                    <div className="bug__value">
                        {bug.assigned_to && <Avatar user={bug.assigned_to} size="50" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
