import axios from 'axios';

import type { ApiResponse } from '../types/api.ts';

const myAxios = axios.create({
    baseURL: 'http://oceanbo.cn/api'
});

myAxios.defaults.withCredentials = true;

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log('我要发请求啦', config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    console.log('我收到你的响应啦', response)
    if (response?.data?.code === 40100) {
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios as typeof myAxios & {
    get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
    post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
};