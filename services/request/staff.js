import { recursoshumanos } from '../apis';

export const findStaff = async (ctx) => {
    let { slug } = ctx.query;
    return await recursoshumanos.get(`public/staff_requirement/${slug}`, {}, ctx)
        .then(res => res.data)
        .catch(err => ({
            success: false,
            status: err.status,
            message: err.message,
            staff: {}
        }));
}