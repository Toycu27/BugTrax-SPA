import { useState } from "react";

export default function ModalBox ({ children, id, buttonTitle }) {
    const [ buttonClicked, setButtonClicked ] = useState(false);

    const handleButtonClick = () => {
        setButtonClicked(true);
    }

    return (<>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleButtonClick} data-bs-toggle="modal" data-bs-target={ "#" + id }>
            { buttonTitle }
        </button>

        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id + "Label"} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button id={id + "_close"} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        { buttonClicked ? children : "Loading..." }
                    </div>
                </div>
            </div>
        </div>
    </>);
}