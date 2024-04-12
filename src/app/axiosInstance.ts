import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from "js-cookie";
const createAxiosInstance = (): AxiosInstance => {
  const headers: AxiosRequestConfig['headers'] = {
    'Content-Type': 'application/json',
  };

  let accessToken;
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    accessToken = localStorage.getItem('accessToken');
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  const res = axios.create({
    baseURL: 'https://agrireachapi.c360.zone/api/v1/',
    // baseURL: 'http://[::1]:7001/api/v1/',
    headers,
  });
  res.interceptors.response.use(
    (response: AxiosResponse) => {
      // console.log('Response Data:', response?.data);
      return response;
    },
    (error) => {
      if (error.response) {
        const { message } = error.response.data;
        if (message === 'LoggedOut') {
          localStorage.clear();
          const cookies = Cookies.get();
          for (const cookie in cookies) {
            Cookies.remove(cookie);
          }
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
  );
  return res;
};

export default createAxiosInstance;

