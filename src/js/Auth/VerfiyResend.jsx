import { useUser } from '../Auth';
import axios from "axios";
import { AlertBox } from '../Form';

export default function Verfiy() {
    const { addMessage } = useUser();

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
                    <h2>E-Mail Verification</h2>
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