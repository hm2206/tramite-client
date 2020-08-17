import NextCookie from 'next-cookies';


export const TOKEN = (ctx) => {
    return NextCookie(ctx)['convocatoria_token'] || null;
}


export const AUTH = async (ctx) => {
    if (!await TOKEN(ctx)) {
        // not authorize
        ctx.res.writeHead(301, { Location: '/' })
        ctx.res.end();
        ctx.res.finished = true;
    }
}


export const GUEST = async (ctx) => {
    if (await TOKEN(ctx)) {
        // not authorize
        ctx.res.writeHead(301, { Location: '/my_postulacion' })
        ctx.res.end();
        ctx.res.finished = true;
    }
}