import { useState } from 'react';

export default function useUser() {
    //User Functions
    const saveUser = user => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    const getUser = () => {
        let user = localStorage.getItem('user');

        return user !== null ? JSON.parse(user) : null;
    }

    const deleteUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    //Form Message Functions
    const addMessage = async (message) => {
        let messages = localStorage.getItem('formMessages');
        messages = JSON.parse(messages);
        if (messages == null) messages = [];

        messages.push(message);

        localStorage.setItem('formMessages', JSON.stringify(messages));
    }

    const getMessage = () => {
        let messages = localStorage.getItem('formMessages');
        messages = JSON.parse(messages);
        if (messages == null) messages = [];

        let message = messages.shift();

        localStorage.setItem('formMessages', JSON.stringify(messages));
        return message;
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
    const [user, setUser] = useState(getUser());

    return {
        setUser: saveUser,
        user: user,
        deleteUser: deleteUser,
        addMessage: addMessage,
        getMessage: getMessage,
        setLastLocation: setLastLocation,
        getLastLocation: getLastLocation,
    }
  }