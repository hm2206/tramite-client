import { tramite } from '../apis';

export const findTramite = async (ctx) => {
    let { slug } = ctx.query;
    return await tramite.get(`public/tramite/${slug}`, {}, ctx)
        .then(res => res.data)
        .catch(err => ({
            success: false,
            status: err.status,
            message: err.message,
            tramite: {}
        }));
}