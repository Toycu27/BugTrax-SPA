import { useEffect, useState } from 'react';
import { useUser } from '../Auth';

export default function AlertBox() {
    const { getMessage } = useUser();
    const [ message, setMessage ] = useState();

    useEffect(() => {
        const refreshMessage = function () {
            let msgTmp = getMessage();
            if (msgTmp) setMessage(msgTmp);
            setTimeout(refreshMessage, 1000);
        }

        setTimeout(refreshMessage, 1000);
    }, []);

    if (message) {
        return (
            <div className={"alert alert-" + message.type} role="alert">
                {message.message}
            </div>
        );
    } else {
        return;
    }
}