import { useState } from 'react';

export default function useGlobals(fileStoragePath) {
    // Create State
    const [user, setUser] = useState(() => {
        const userLocal = localStorage.getItem('user');
        return userLocal !== null ? JSON.parse(userLocal) : null;
    });

    const [messages, setMessages] = useState(() => {
        const messagesLocal = localStorage.getItem('messages');
        return messagesLocal !== null ? JSON.parse(messagesLocal) : null;
    });

    // User Functions
    const saveUser = (userVar) => {
        if (userVar == null) userVar = null;

        localStorage.setItem('user', JSON.stringify(userVar));
        setUser(userVar);
    };

    const deleteUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const hasRole = (roles = []) => roles.includes(user.role);

    // Form Message Functions
    const addMessage = async (message, type = 'success') => {
        let messagesLocal = localStorage.getItem('messages');
        // eslint-disable-next-line eqeqeq
        if (messagesLocal == '') messagesLocal = 'null';
        messagesLocal = JSON.parse(messagesLocal);
        if (messagesLocal === null) messagesLocal = [];

        messagesLocal.push({
            message,
            type,
            timestamp: Math.floor(Date.now() / 1000),
        });

        localStorage.setItem('messages', JSON.stringify(messagesLocal));
        setMessages(messagesLocal);
    };

    const getMessages = () => {
        let messagesLocal = JSON.parse(localStorage.getItem('messages'));
        if (messagesLocal == null) messagesLocal = [];

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const filteredMessages = messagesLocal.filter(
            (message) => message.timestamp + 14 > currentTimestamp,
        );

        localStorage.setItem('messages', JSON.stringify(filteredMessages));
        setMessages(filteredMessages);
        return filteredMessages;
    };

    // Navigation Functions
    const setLastLocation = (pathname) => {
        localStorage.setItem('lastLocation', pathname);
    };

    const getLastLocation = () => {
        const location = localStorage.getItem('lastLocation');
        return location !== null ? location : '/';
    };

    // Theme Functions
    const setThemeMode = (mode) => {
        localStorage.setItem('themeMode', mode);
    };

    const getThemeMode = () => {
        let mode = localStorage.getItem('themeMode');
        if (mode === null) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                mode = 'light';
            } else {
                mode = 'dark';
            }
        }
        return mode;
    };

    return {
        user,
        setUser: saveUser,
        deleteUser,
        hasRole,
        messages,
        addMessage,
        getMessages,
        setLastLocation,
        getLastLocation,
        setThemeMode,
        getThemeMode,
        fileStoragePath,
    };
}
