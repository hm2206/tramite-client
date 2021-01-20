import { tramite } from "../apis";

export const findTramite = async (ctx) => {
  let { slug } = ctx.query;
  if (!slug) {
    return {
      success: false,
      status: 501,
      message: null,
      tramite: {},
    };
  }
  return await tramite
    .get(`tramite/${slug}/timeline`, {}, ctx)
    .then((res) => res.data)
    .catch((err) => ({
      success: false,
      status: err.status,
      message: err.message,
      tramite: {},
    }));
};
