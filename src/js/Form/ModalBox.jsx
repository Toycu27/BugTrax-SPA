import { useState } from "react";

export default function ModalBox ({ children, id, buttonStyle, buttonIcon, buttonTitle }) {
    const [ buttonClicked, setButtonClicked ] = useState(false);

    const handleButtonClick = () => {
        setButtonClicked(true);
    }

    return (<>
        { buttonStyle === "link" ? 
            <div type="button" className="link" onClick={handleButtonClick} data-bs-toggle="modal" data-bs-target={ "#" + id }>
                { buttonIcon ? <i class={"bi bi-" + buttonIcon}></i> : null } { buttonTitle }
            </div>
        :
            <button type="button" className="btn btn-primary btn-sm" onClick={handleButtonClick} data-bs-toggle="modal" data-bs-target={ "#" + id }>
                { buttonTitle }
            </button>
        }

        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={id + "Label"} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-body">
                        <button id={id + "_close"} type="button" className="btn-close mb-3" data-bs-dismiss="modal" aria-label="Close"></button>
                        { buttonClicked ? children : "Loading..." }
                    </div>
                </div>
            </div>
        </div>
    </>);
}