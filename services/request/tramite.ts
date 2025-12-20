import { tramite } from "../apis";

interface TimelineResponse {
  success: boolean;
  status?: number;
  message?: string | null;
  trackings: Record<string, any>;
}

interface TramiteResponse {
  success: boolean;
  status?: number;
  message?: string | null;
  tramite: Record<string, any>;
  trackings?: Record<string, any>;
}

export const getTimeline = async (slug: string, page: number = 1): Promise<TimelineResponse> => {
  if (!slug) {
    return {
      success: false,
      status: 501,
      message: null,
      trackings: {},
    };
  }
  return await tramite
    .get<TimelineResponse>(`tramite/${slug}/timeline?page=${page}`)
    .then((res) => res.data)
    .catch((err) => ({
      success: false,
      status: err.status,
      message: err.message,
      trackings: {},
    }));
};

export const findTramite = async (slug: string): Promise<TramiteResponse> => {
  if (!slug) {
    return {
      success: false,
      status: 501,
      message: null,
      tramite: {},
    };
  }
  return await tramite
    .get<TramiteResponse>(`tramite/${slug}?column=slug`)
    .then((res) => res.data)
    .catch((err) => ({
      success: false,
      status: err.status,
      message: err.message,
      tramite: {},
    }));
};

export const codigo_qr = async (slug: string): Promise<string | TramiteResponse> => {
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
      const type = res.headers["content-type"];
      const blob = new Blob([res.data], { type });
      const url = URL.createObjectURL(blob);
      return url;
    })
    .catch((err) => ({
      success: true,
      status: err.status,
      message: err.message,
      tramite: {},
    }));
};
