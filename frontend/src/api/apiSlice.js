import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, ENDPOINTS } from "./apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["RegistrationCount", "Technologies"],
  endpoints: (builder) => ({
    getTechnologies: builder.query({
      query: () => ENDPOINTS.GET_TECHNOLOGIES,
      providesTags: ["Technologies"],
    }),
    getRegistrationCount: builder.query({
      query: () => ENDPOINTS.COUNT_REG,
      providesTags: ["RegistrationCount"],
    }),
    submitRegistration: builder.mutation({
      query: (formData) => ({
        url: ENDPOINTS.SUBMIT_FORM,
        method: "POST",
        body: formData,
      }),
      // Invalidate the registration count so it fetches the fresh count instantly after registration
      invalidatesTags: ["RegistrationCount"],
    }),
  }),
});

export const {
  useGetTechnologiesQuery,
  useGetRegistrationCountQuery,
  useSubmitRegistrationMutation,
} = apiSlice;
