import { useContext } from 'react';
import { GlobalContext } from '../Auth';
import { AlertBox } from '../Form';
import axios from "axios";

export default function Verfiy() {
    const { addMessage } = useContext(GlobalContext);

    const handleClick = async e => {
        e.preventDefault();
        const response = await axios.postRequest('email/verification-notification');

        if (response.errors) {
            addMessage(response.message, "danger");
        } else {
            addMessage(response.message);
        }
    }

    return (<div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
                <div className="mb-3">
                    <h1>E-Mail Verification</h1>
                </div>
                <div className="row">
                    <p className="mb-4">
                        Please Verify your E-Mail Adress by clicking the Link we send to your E-Mail.
                    </p>
                    <AlertBox />
                    <div className="d-grid">
                        <button onClick={handleClick} className="btn btn-primary btn-lg">Resend Verification</button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}