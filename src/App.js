import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import {
    ProtectedRoute as Protected,
    Login, Logout, Register, UpdateUser, ForgotPassword, ResetPassword, VerfiyResend,
} from './js/auth';
import {
    Home, PageNotFound, BugForm, MilestoneForm, ProjectForm,
    Projects, Milestones, Bugs, Search, Statistics, Board, Users,
} from './js/pages';
import Layout from './Layout';
import { useGlobals, GlobalContext, setAxiosDefaults } from './js';

// Settings
export const backendPathDev = 'http://localhost:8000/';
export const backendPathProd = 'https://api.bugtrax.de/';
export const backendPath = backendPathDev;

const { axios } = setAxiosDefaults();
axios.defaults.baseURL = backendPath;

export default function App() {
    const GLOBALS = useGlobals(`${backendPath}storage/`);

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
