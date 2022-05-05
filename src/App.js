import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Layout, PageNotFound, Projects, Project, Milestones, Milestone, Bugs, Bug } from './js/View';
import { useUser, ProtectedRoute as Protected, Login, Register, UpdateUser, ForgotPassword, ResetPassword, VerfiyResend } from './js/Auth';
import axios from "axios";

//Axios Settings START
axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axios.defaults.responseType = 'json';
axios.defaults.responseEncoding = 'utf8';
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest', 
  'X-Host-Override': 'localhost',
  'Content-Type': 'application/json'
};
axios.interceptors.request.use(function (config) {
  if (
    //config.method == 'PATCH'
    config.url == 'sanctum/token' 
    || config.url == 'forgot-password' 
    || config.url == 'reset-password' 
    || config.url == 'register'
    || config.url == 'email/verification-notification'
  ) {
    return axios.get('sanctum/csrf-cookie').then(response => config);
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.getRequest = async (path, callback = () => {}) => {
  return axios.get(path)
      .then(function (response) {
          callback(response);
          return response.data;
      })
      .catch(function (error) {
          return error.response.data;
      });
}

axios.postRequest = async (path, body) => {
  return axios.post(path, JSON.stringify(body))
      .then(function (response) {
          return response.data;
      })
      .catch(function (error) {
          return error.response.data;
      });
}

axios.patchRequest = async (path, body) => {
  return axios.patch(path, JSON.stringify(body))
      .then(function (response) {
          return response.data;
      })
      .catch(function (error) {
          return error.response.data;
      });
}

axios.deleteRequest = async (path) => {
  return axios.delete(path)
      .then(function (response) {
          return response.data;
      })
      .catch(function (error) {
          return error.response.data;
      });
}
//Axios Settings END

export default function App() {
  const { user, setUser, deleteUser } = useUser();

  if (user) {
      axios.defaults.headers['Authorization'] = 'Bearer ' + user.token;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} deleteUser={deleteUser}/>}>
          {/* Default Route */}
          <Route index element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerfiyResend />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/user" element={<Protected><UpdateUser /></Protected>} />

          {/* Routes */}
          <Route path="/projects" element={<Protected><Projects /></Protected>}/>
          <Route path="/milestones" element={<Protected><Milestones /></Protected>}/>
          <Route path="/bugs" element={<Protected><Bugs /></Protected>}/>

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}