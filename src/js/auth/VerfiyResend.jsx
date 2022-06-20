import React, { useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../';
import { AlertBox } from '../shared';

export default function Verfiy() {
    const { addMessage } = useContext(GlobalContext);

    const handleClick = async (e) => {
        e.preventDefault();
        const response = await axios.postRequest('email/verification-notification');

        if (response.errors) {
            addMessage(response.message, 'danger');
        } else {
            addMessage(response.message);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-6">
                    <div className="mb-3">
                        <h1>E-Mail Verification</h1>
                    </div>
                    <AlertBox />
                    <div className="row">
                        <p className="mb-4">
                            Please Verify your E-Mail Adress by clicking the Link we send to your E-Mail.
                        </p>
                        <div className="d-grid">
                            <button type="button" onClick={handleClick} className="btn btn-primary btn-lg">Resend Verification</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
