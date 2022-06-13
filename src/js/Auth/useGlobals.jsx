import { useState } from 'react';

export default function useGlobals() {

    //User Functions
    const saveUser = (user) => {
        if (user == null) user = null;

        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    const deleteUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    const hasRole = (roles = []) => {
        return roles.includes(user.role);
    }


    //Form Message Functions
    const addMessage = async (message, type = "success") => {
        let messages = localStorage.getItem('messages');
        if (messages == '') messages = 'null';
        messages = JSON.parse(messages);
        if (messages === null) messages = [];

        messages.push({
            message: message, 
            type: type, 
            timestamp: Math.floor(Date.now() / 1000),
        });

        localStorage.setItem('messages', JSON.stringify(messages));
        setMessages(messages);
    }

    const getMessages = () => {
        let messages = JSON.parse(localStorage.getItem('messages'));
        if (messages == null) messages = [];

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const filteredMessages = messages.filter(message => message.timestamp + 10 > currentTimestamp);

        localStorage.setItem('messages', JSON.stringify(filteredMessages));
        setMessages(filteredMessages);
        return filteredMessages;
    }


    //Navigation Functions
    const setLastLocation = (pathname) => {
        localStorage.setItem('lastLocation', pathname);
    }

    const getLastLocation = () => {
        let location = localStorage.getItem('lastLocation');
        return location !== null ? location : '/';
    }


    //Create State
    const [user, setUser] = useState(() => {
        let user = localStorage.getItem('user');
        return user !== null ? JSON.parse(user) : null;
    });

    const [messages, setMessages] = useState(() => {
        let messages = localStorage.getItem('messages');
        return messages !== null ? JSON.parse(messages) : null;
    });

    return {
        user: user,
        setUser: saveUser,
        deleteUser: deleteUser,
        hasRole: hasRole,
        messages: messages,
        addMessage: addMessage,
        getMessages: getMessages,
        setLastLocation: setLastLocation,
        getLastLocation: getLastLocation,
    }
  }