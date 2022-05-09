import { useUser } from '../Auth';
import axios from "axios";
import { AlertBox } from '../Form';

export default function Verfiy() {
    const { addMessage } = useUser();

    const handleClick = async e => {
        e.preventDefault();
        const response = await axios.postRequest('email/verification-notification');

        if (response.errors) {
            alert(response.message);
        } else {
            addMessage(response.message);
        }
    }

    return (
        <div className="row justify-content-md-center">
            <div className="col-sm-6">
                <div className="mb-3">
                    <h2>E-Mail Verification</h2>
                </div>
                <div className="">
                    <p className="mb-4">
                        Please Verify your E-Mail Adress by clicking the Link we send to your E-Mail.
                    </p>
                    <button onClick={handleClick} className="btn btn-primary btn-lg">Resend Verification</button>
                </div>
                <AlertBox />
            </div>
        </div>
    );
}