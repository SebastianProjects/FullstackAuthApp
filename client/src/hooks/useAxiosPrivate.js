import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefresh from './useRefresh';
import useAuth from "./useAuth";
import { useNavigate, useLocation } from 'react-router-dom'

const useAxiosPrivate = () => {
    const refresh = useRefresh();
    const { authState } = useAuth();
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState?.token}`;
                }
                return config;
            }, (err) => Promise.reject(err)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (err) => {
                const prevRequest = err?.config;
                console.log(prevRequest._retry)
                if (err?.response?.status === 403 && !prevRequest?._retry) {
                    prevRequest._retry = true;
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        navigate('/login', { state: { from: location }, replace: true });
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(err);
            }
        )

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.response.eject(requestIntercept);
        }
    }, [authState, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;