import { tramite } from "../apis";

export const getTimeline = async (slug, page = 1, ctx = null) => {
  if (!slug) {
    return {
      success: false,
      status: 501,
      message: null,
      trackings: {},
    };
  }
  return await tramite
    .get(`tramite/${slug}/timeline?page=${page}`, {}, ctx)
    .then((res) => res.data)
    .catch((err) => ({
      success: false,
      status: err.status,
      message: err.message,
      trackings: {},
    }));
};

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
    .get(`tramite/${slug}?column=slug`, {}, ctx)
    .then((res) => res.data)
    .catch((err) => ({
        success: false,
        status: err.status,
        message: err.message,
        tramite: {},
      }));
};

export const codigo_qr = async (slug) => {
  if (!slug) {
    return {
      success: false,
      status: 501,
      message: null,
      tramite: {},
    };
  }
  return await tramite
    .get(`tramite/${slug}/code_qr`, { responseType: "blob" })

    .then(async (res) => {
      let type = res.headers["content-type"];
      let blob = new Blob([res.data], { type });
      let url = await URL.createObjectURL(blob);

      return url;
    })
    .catch((err) => ({
      success: true,
      status: err.status,
      message: err.message,
      tramite: {},
    }));
};
