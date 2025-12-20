import Cookies from 'js-cookie';
import Router from 'next/router';

export const TOKEN = (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || null;
}

export const AUTH = (): boolean => {
    if (typeof window === 'undefined') return false;
    if (!TOKEN()) {
        Router.replace('/');
        return false;
    }
    return true;
}

export const GUEST = (): boolean => {
    if (typeof window === 'undefined') return false;
    if (TOKEN()) {
        Router.replace('/my_postulacion');
        return false;
    }
    return true;
}

export const LOGIN = (token: string): void => {
    Cookies.set('convocatoria_token', token);
    localStorage.setItem('convocatoria_token', token);
}

export const LOGOUT = (): void => {
    Cookies.remove('convocatoria_token');
    localStorage.removeItem('convocatoria_token');
}
