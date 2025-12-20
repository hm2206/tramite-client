import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_TRAMITE || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';

const getToken = (): string => {
  if (typeof window === 'undefined') return '';
  return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || '';
};

export const tramiteApi = createApi({
  reducerPath: 'tramiteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { endpoint }) => {
      // Don't set Content-Type for FormData (file uploads) - browser will set it with boundary
      if (endpoint !== 'createTramite') {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('ClientId', CLIENT_ID);
      headers.set('ClientSecret', CLIENT_SECRET);
      headers.set('AuthConvocatoria', getToken());
      return headers;
    },
  }),
  tagTypes: ['Tramite', 'Timeline', 'TramiteType', 'Dependencia'],
  endpoints: (builder) => ({
    // Find Tramite by Slug
    findTramite: builder.query<any, string>({
      query: (slug) => `tramite/${slug}?column=slug`,
      providesTags: ['Tramite'],
    }),

    // Get Timeline
    getTimeline: builder.query<any, { slug: string; page?: number }>({
      query: ({ slug, page = 1 }) => `tramite/${slug}/timeline?page=${page}`,
      providesTags: ['Timeline'],
    }),

    // Get Tramite Types
    getTramiteTypes: builder.query<any, { page?: number }>({
      query: ({ page = 1 }) => `tramite_type?page=${page}`,
      providesTags: ['TramiteType'],
    }),

    // Get Dependencias Externas
    getDependenciasExternas: builder.query<any, { entityId: string; code?: string | null }>({
      query: ({ entityId, code }) => `public/dependencia/${entityId}?code=${code || ''}`,
      providesTags: ['Dependencia'],
    }),

    // Create Tramite
    createTramite: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'public/tramite',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Tramite'],
    }),

    // Get Code QR
    getCodeQR: builder.query<string, string>({
      query: (slug) => ({
        url: `tramite/${slug}/code_qr`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
    }),
  }),
});

export const {
  useFindTramiteQuery,
  useLazyFindTramiteQuery,
  useGetTimelineQuery,
  useGetTramiteTypesQuery,
  useGetDependenciasExternasQuery,
  useCreateTramiteMutation,
  useGetCodeQRQuery,
} = tramiteApi;
