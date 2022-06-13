import { useEffect, useContext } from 'react';
import { GlobalContext } from '../Auth';

export default function AlertBox() {
    const { messages, getMessages } = useContext(GlobalContext);

    useEffect(() => {
        getMessages();
    }, [messages]);

    if (messages) {
        return (<>
            { messages.map((message, index) => 
                <div key={index} className={"alert alert-" + message.type} role="alert">
                    {message.message}
                </div>
            )}
        </>);
    } else {
        return;
    }
}