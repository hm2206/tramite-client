import axios from 'axios';
import { url, credencials } from '../env.json';
import Cookies from 'js-cookie';
import NextCookies from 'next-cookies';


let headers = {
    AuthConvocatoria: `${Cookies.get('convocatoria_token')}`
};

export const configAuthConvocatoria = async (ctx) => {
    return await `${NextCookies(ctx)['convocatoria_token']}`;
}

const ConfigHeaders = async (ctx = null, config = {}) => {
    let newConfig = Object.assign({}, config);
    newConfig.headers = config.headers || {};
    // add credenciales
    for (let attr in credencials) {
        newConfig.headers[attr] = credencials[attr];
    }
    // validar ctx
    if (ctx) {
        newConfig.headers.AuthConvocatoria = await configAuthConvocatoria(ctx);
    } else {
        newConfig.headers.AuthConvocatoria = await headers.AuthConvocatoria
    };
    return newConfig;
}


/**
 *  api para consumir el authenticador
 */
export const authentication = {
    get: async (path, config = {}, ctx = null) => {
        return axios.get(`${url.API_AUTHENTICATION}/${path}`, await ConfigHeaders(ctx, config));
    },
    post: async (path, body = {}, config = {}, ctx = null) => {
        return axios.post(`${url.API_AUTHENTICATION}/${path}`, body, await ConfigHeaders(ctx, config));
    },
    path: url.API_AUTHENTICATION
};


/**
 * api para consumir el sistema de tramite
 */
export const tramite = {
    get: async (path, config = {}, ctx) => {
        return axios.get(`${url.API_TRAMITE}/${path}`, await ConfigHeaders(ctx, config));
    },
    post: async (path, body = {}, config = {}, ctx) => {
        return axios.post(`${url.API_TRAMITE}/${path}`, body, await ConfigHeaders(ctx, config));
    },
    fetch: async (path, config = {}, ctx) => {
        return fetch(`${url.API_TRAMITE}/${path}`, await ConfigHeaders(ctx, config));
    },
    path: url.API_TRAMITE
};


/**
 * api para consumir el sistema de académico
 */
 export const academico = {
    get: async (path, config = {}, ctx) => {
        return axios.get(`${url.API_ACADEMICO}/${path}`, await ConfigHeaders(ctx, config));
    },
    post: async (path, body = {}, config = {}, ctx) => {
        return axios.post(`${url.API_ACADEMICO}/${path}`, body, await ConfigHeaders(ctx, config));
    },
    fetch: async (path, config = {}, ctx) => {
        return fetch(`${url.API_ACADEMICO}/${path}`, await ConfigHeaders(ctx, config));
    },
    path: url.API_TRAMITE
};
