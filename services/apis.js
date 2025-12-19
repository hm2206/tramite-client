import axios from 'axios';
import { url, credencials } from '../env.json';
import Cookies from 'js-cookie';

const getToken = () => {
    if (typeof window === 'undefined') return '';
    return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || '';
}

const ConfigHeaders = (config = {}) => {
    let newConfig = Object.assign({}, config);
    newConfig.headers = config.headers || {};
    // add credenciales
    for (let attr in credencials) {
        newConfig.headers[attr] = credencials[attr];
    }
    // add token
    newConfig.headers.AuthConvocatoria = getToken();
    return newConfig;
}

/**
 *  api para consumir el authenticador
 */
export const authentication = {
    get: async (path, config = {}) => {
        return axios.get(`${url.API_AUTHENTICATION}/${path}`, ConfigHeaders(config));
    },
    post: async (path, body = {}, config = {}) => {
        return axios.post(`${url.API_AUTHENTICATION}/${path}`, body, ConfigHeaders(config));
    },
    path: url.API_AUTHENTICATION
};

/**
 * api para consumir el sistema de tramite
 */
export const tramite = {
    get: async (path, config = {}) => {
        return axios.get(`${url.API_TRAMITE}/${path}`, ConfigHeaders(config));
    },
    post: async (path, body = {}, config = {}) => {
        return axios.post(`${url.API_TRAMITE}/${path}`, body, ConfigHeaders(config));
    },
    fetch: async (path, config = {}) => {
        return fetch(`${url.API_TRAMITE}/${path}`, ConfigHeaders(config));
    },
    path: url.API_TRAMITE
};

/**
 * api para consumir el sistema de académico
 */
export const academico = {
    get: async (path, config = {}) => {
        return axios.get(`${url.API_ACADEMICO}/${path}`, ConfigHeaders(config));
    },
    post: async (path, body = {}, config = {}) => {
        return axios.post(`${url.API_ACADEMICO}/${path}`, body, ConfigHeaders(config));
    },
    fetch: async (path, config = {}) => {
        return fetch(`${url.API_ACADEMICO}/${path}`, ConfigHeaders(config));
    },
    path: url.API_TRAMITE
};
