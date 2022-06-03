import { fileStoragePath } from '../../App.js';
import { Link } from "react-router-dom";

export default function BoardBug({bug}) {

    let difficultyIconMap = {
        'Easy': 'bi bi-chevron-compact-down text-primary fs-4',
        'Normal': 'bi bi-dash-lg text-warning fs-4',
        'Hard': 'bi bi-chevron-compact-up text-danger fs-4',
        'Unknown': 'bi bi-question text-secondary fs-4',
    };

    return (
        <div className="board__bug bg-light bg-opacity-50 p-2 pt-1 mb-2 text-start">
            <div className="row gx-1">
                <div className="col-auto">
                    <div className="bug__value"><i className="bi bi-hash fs-5"></i>{bug.id}</div>
                </div>
                <div className="col text-end pt-1">
                    <div className="bug__value">{new Date(bug.end_date).toLocaleDateString()}</div>
                </div>
                <div className="col-auto text-end">
                    <div className="bug__value"><i className={difficultyIconMap[bug.difficulty]}></i></div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="bug__value">
                        <Link to={"/bug/" + bug.id}>{bug.title}</Link>
                    </div>
                </div>

                <div className="col-auto">
                    <div className="bug__value">
                        {bug.assigned_to &&
                            <img className="rounded-circle border border-1" height="50px" width="50px"
                                src={bug.assigned_to.avatar_path ? fileStoragePath + bug.assigned_to.avatar_path : "https://i.pravatar.cc/50?img=" + bug.assigned_to.id} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}