import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_AUTHENTICATION = process.env.NEXT_PUBLIC_API_AUTHENTICATION || '';
const API_TRAMITE = process.env.NEXT_PUBLIC_API_TRAMITE || '';
const API_ACADEMICO = process.env.NEXT_PUBLIC_API_ACADEMICO || '';

interface CustomHeaders {
    ClientId?: string;
    ClientSecret?: string;
    Authorization?: string;
    AuthConvocatoria?: string;
    [key: string]: string | undefined;
}

interface CustomConfig extends AxiosRequestConfig {
    headers?: CustomHeaders;
}

const getToken = (): string => {
    if (typeof window === 'undefined') return '';
    return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || '';
}

const ConfigHeaders = (config: CustomConfig = {}): CustomConfig => {
    const newConfig: CustomConfig = { ...config };
    newConfig.headers = { ...config.headers } as CustomHeaders;
    newConfig.headers.ClientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';
    newConfig.headers.ClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';
    newConfig.headers.Authorization = process.env.NEXT_PUBLIC_AUTHORIZATION || '';
    newConfig.headers.AuthConvocatoria = getToken();
    return newConfig;
}

export const authentication = {
    get: async <T = any>(path: string, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.get<T>(`${API_AUTHENTICATION}/${path}`, ConfigHeaders(config));
    },
    post: async <T = any>(path: string, body: object = {}, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.post<T>(`${API_AUTHENTICATION}/${path}`, body, ConfigHeaders(config));
    },
    path: API_AUTHENTICATION
};

export const tramite = {
    get: async <T = any>(path: string, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.get<T>(`${API_TRAMITE}/${path}`, ConfigHeaders(config));
    },
    post: async <T = any>(path: string, body: object = {}, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.post<T>(`${API_TRAMITE}/${path}`, body, ConfigHeaders(config));
    },
    fetch: async (path: string, config: RequestInit = {}): Promise<Response> => {
        return fetch(`${API_TRAMITE}/${path}`, config);
    },
    path: API_TRAMITE
};

export const academico = {
    get: async <T = any>(path: string, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.get<T>(`${API_ACADEMICO}/${path}`, ConfigHeaders(config));
    },
    post: async <T = any>(path: string, body: object = {}, config: CustomConfig = {}): Promise<AxiosResponse<T>> => {
        return axios.post<T>(`${API_ACADEMICO}/${path}`, body, ConfigHeaders(config));
    },
    fetch: async (path: string, config: RequestInit = {}): Promise<Response> => {
        return fetch(`${API_ACADEMICO}/${path}`, config);
    },
    path: API_ACADEMICO
};
