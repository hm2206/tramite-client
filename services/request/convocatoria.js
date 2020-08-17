import { recursoshumanos } from '../apis';

export const getConvocatoriaList = async (ctx) => {
    let { page } = ctx.query;
    return await recursoshumanos.get(`public/convocatoria?page=${page || 1}`, {}, ctx)
        .then(res => res.data)
        .catch(err => ({
            success: false,
            status: err.status || 501,
            message: err.message,
            convocatoria: {
                lastPage: 1,
                page: 1,
                data: [],
                total: 0
            }
        }));
}