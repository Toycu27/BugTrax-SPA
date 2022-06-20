import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { useGlobals, GlobalContext, ProtectedRoute as Protected,
    Login, Logout, Register, UpdateUser, ForgotPassword, ResetPassword, VerfiyResend } from './js/Auth';
import { Home, Layout, PageNotFound, Projects, Milestones, Bugs, Search, Statistics, Board, Users } from './js/View';
import { BugForm, MilestoneForm, ProjectForm } from './js/Form';

// Settings
export const backendPathDev = 'http://localhost:8000/';
export const backendPathProd = 'https://api.bugtrax.de/';
export const backendPath = backendPathDev;
export const fileStoragePath = `${backendPath}storage/`;

// Axios Settings START
axios.defaults.baseURL = backendPath;
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

axios.getRequest = async (path, callback = () => {}) => axios.get(path)
    .then((response) => {
        callback(response);
        response.data.success = true;
        return response.data;
    })
    .catch((error) => {
        error.response.data.success = false;
        return error.response.data;
    });

axios.postRequest = async (path, body) => axios.post(path, JSON.stringify(body))
    .then((response) => {
        response.data.success = true;
        return response.data;
    })
    .catch((error) => {
        error.response.data.success = false;
        return error.response.data;
    });

axios.postRequestWithFile = async (path, file) => {
    const settings = { ...axios.defaults };
    settings.headers = {
        ...axios.defaults.headers,
        'Content-Type': 'multipart/form-data',
    };

    return axios.post(path, file, settings)
        .then((response) => {
            response.data.success = true;
            return response.data;
        })
        .catch((error) => {
            error.response.data.success = false;
            return error.response.data;
        });
};

axios.patchRequest = async (path, body) => axios.patch(path, JSON.stringify(body))
    .then((response) => {
        response.data.success = true;
        return response.data;
    })
    .catch((error) => {
        error.response.data.success = false;
        return error.response.data;
    });

axios.deleteRequest = async (path, callback = () => {}) => axios.delete(path)
    .then((response) => {
        callback(response);
        response.data.success = true;
        return response.data;
    })
    .catch((error) => {
        callback(error);
        error.response.data.success = false;
        return error.response.data;
    });
// Axios Settings END

export default function App() {
    const GLOBALS = useGlobals();

    if (GLOBALS.user) {
        axios.defaults.headers.Authorization = `Bearer ${GLOBALS.user.token}`;
    }

    return (
        <GlobalContext.Provider value={GLOBALS}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Default Route */}
                        <Route index element={<Home />} />

                        {/* Auth Routes */}
                        <Route path="/login" element={<Login key={1} />} />
                        <Route path="/demo/login" element={<Login demoLogin key={2} />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify" element={<VerfiyResend />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/password-reset/:token" element={<ResetPassword />} />
                        <Route path="/user" element={<Protected><UpdateUser /></Protected>} />

                        {/* Routes */}
                        <Route path="/search/:input" element={<Protected><Search /></Protected>} />
                        <Route path="/projects" element={<Protected><Projects /></Protected>} />
                        <Route path="/milestones" element={<Protected><Milestones /></Protected>} />
                        <Route path="/bugs" element={<Protected><Bugs /></Protected>} />
                        <Route path="/statistics" element={<Protected><Statistics /></Protected>} />
                        <Route path="/board" element={<Protected><Board /></Protected>} />
                        <Route path="/users" element={<Protected><Users /></Protected>} />

                        <Route path="/project" element={<Protected><ProjectForm /></Protected>} />
                        <Route path="/project/:id" element={<Protected><ProjectForm /></Protected>} />
                        <Route path="/milestone" element={<Protected><MilestoneForm /></Protected>} />
                        <Route path="/milestone/:id" element={<Protected><MilestoneForm /></Protected>} />
                        <Route path="/bug" element={<Protected><BugForm /></Protected>} />
                        <Route path="/bug/:id" element={<Protected><BugForm /></Protected>} />

                        {/* 404 Route */}
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    );
}
