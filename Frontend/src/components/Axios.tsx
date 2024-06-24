import axios from "axios";
import RefreshAccessToken from "./Auth.tsx";
import {API_URL} from "../config.tsx";

const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(async (config) => {
    await RefreshAccessToken();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;