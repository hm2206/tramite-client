import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_AUTHENTICATION || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';

const getToken = (): string => {
  if (typeof window === 'undefined') return '';
  return Cookies.get('convocatoria_token') || localStorage.getItem('convocatoria_token') || '';
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('ClientId', CLIENT_ID);
      headers.set('ClientSecret', CLIENT_SECRET);
      headers.set('AuthConvocatoria', getToken());
      return headers;
    },
  }),
  tagTypes: ['App', 'Person', 'Entity', 'DocumentType', 'Departamento', 'Provincia', 'Distrito'],
  endpoints: (builder) => ({
    // Get App Info
    getAppInfo: builder.query<any, void>({
      query: () => 'app/me',
      providesTags: ['App'],
    }),

    // Get Person by Document
    getPersonByDocument: builder.query<any, string>({
      query: (documentNumber) => `person/${documentNumber}?type=document_number`,
      providesTags: ['Person'],
    }),

    // Create Person
    createPerson: builder.mutation<any, any>({
      query: (body) => ({
        url: 'public/people',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Person'],
    }),

    // Get Entities
    getEntities: builder.query<any, { page?: number }>({
      query: ({ page = 1 }) => `entity?page=${page}`,
      providesTags: ['Entity'],
    }),

    // Get Document Types
    getDocumentTypes: builder.query<any, { page?: number }>({
      query: ({ page = 1 }) => `document_type?page=${page}`,
      providesTags: ['DocumentType'],
    }),

    // Get Departamentos
    getDepartamentos: builder.query<any, { page?: number }>({
      query: ({ page = 1 }) => `departamento?page=${page}`,
      providesTags: ['Departamento'],
    }),

    // Get Provincias
    getProvincias: builder.query<any, { departamentoId: string; page?: number }>({
      query: ({ departamentoId, page = 1 }) => `departamento/${departamentoId}/provincia?page=${page}`,
      providesTags: ['Provincia'],
    }),

    // Get Distritos
    getDistritos: builder.query<any, { departamentoId: string; provinciaId: string; page?: number }>({
      query: ({ departamentoId, provinciaId, page = 1 }) =>
        `departamento/${departamentoId}/provincia/${provinciaId}/distrito?page=${page}`,
      providesTags: ['Distrito'],
    }),

    // Get Student from SIGA
    getStudentFromSiga: builder.query<any, string>({
      query: (dni) => `apis/siga/get_resolver?url=alumnos/dni/${dni}`,
    }),
  }),
});

export const {
  useGetAppInfoQuery,
  useGetPersonByDocumentQuery,
  useLazyGetPersonByDocumentQuery,
  useCreatePersonMutation,
  useGetEntitiesQuery,
  useGetDocumentTypesQuery,
  useGetDepartamentosQuery,
  useGetProvinciasQuery,
  useGetDistritosQuery,
  useLazyGetStudentFromSigaQuery,
} = authApi;
