import axios from 'axios';

export default function setAxiosDefaults() {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
    axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
    axios.defaults.responseType = 'json';
    axios.defaults.responseEncoding = 'utf8';
    axios.defaults.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Host-Override': 'localhost',
        'Content-Type': 'application/json',
    };

    axios.interceptors.request.use((config) => {
        if (
            config.url === 'sanctum/token'
            || config.url === 'forgot-password'
            || config.url === 'reset-password'
            || config.url === 'register'
            || config.url === 'email/verification-notification'
        ) {
            return axios.get('sanctum/csrf-cookie').then(() => config);
        }
        return config;
    }, (error) => Promise.reject(error));

    axios.getRequest = async (path, callback = () => { }, callbackFail = () => { }) => axios.get(path)
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            callbackFail(error.response.data);
        });

    axios.postRequest = async (path, body, callback = () => { }, callbackFail = () => { }) => axios.post(path, JSON.stringify(body))
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            callbackFail(error.response.data);
        });

    axios.postRequestWithFile = async (path, file, callback = () => { }, callbackFail = () => { }) => {
        const settings = { ...axios.defaults };
        settings.headers = {
            ...axios.defaults.headers,
            'Content-Type': 'multipart/form-data',
        };

        return axios.post(path, file, settings)
            .then((response) => {
                callback(response.data);
            })
            .catch((error) => {
                callbackFail(error.response.data);
            });
    };

    axios.patchRequest = async (path, body, callback = () => { }, callbackFail = () => { }) => axios.patch(path, JSON.stringify(body))
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            callbackFail(error.response.data);
        });

    axios.deleteRequest = async (path, callback = () => { }, callbackFail = () => { }) => axios.delete(path)
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            callbackFail(error.response.data);
        });

    return { axios };
}
