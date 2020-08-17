import { recursoshumanos } from '../apis';

export const getMyPostulacion = async (ctx) => {
    let { page } = ctx.query;
    return await recursoshumanos.get(`auth/my_postulacion`, {}, ctx)
        .then(res => res.data)
        .catch(err => ({
            success: false,
            status: err.status || 501,
            message: err.message,
            staff: {
                lastPage: 1,
                page: 1,
                data: [],
                total: 0
            }
        }));
}