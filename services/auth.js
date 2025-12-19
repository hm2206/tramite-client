import Cookies from 'js-cookie';
import Router from 'next/router';

export const TOKEN = () => {
    if (typeof window === 'undefined') return null;
    return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || null;
}

export const AUTH = () => {
    if (typeof window === 'undefined') return false;
    if (!TOKEN()) {
        Router.replace('/');
        return false;
    }
    return true;
}

export const GUEST = () => {
    if (typeof window === 'undefined') return false;
    if (TOKEN()) {
        Router.replace('/my_postulacion');
        return false;
    }
    return true;
}

export const LOGIN = (token) => {
    Cookies.set('convocatoria_token', token);
    localStorage.setItem('convocatoria_token', token);
}

export const LOGOUT = () => {
    Cookies.remove('convocatoria_token');
    localStorage.removeItem('convocatoria_token');
}
