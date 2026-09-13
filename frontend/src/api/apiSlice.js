import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, ENDPOINTS } from "./apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [
    "RegistrationCount",
    "Technologies",
    "BootcampCount",
    "Hackathons",
    "HackathonCount",
    "HackathonLeaderboard",
  ],
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
    getBootcampCount: builder.query({
      query: () => ENDPOINTS.COUNT_BOOTCAMP,
      providesTags: ["BootcampCount"],
    }),
    submitBootcampRegistration: builder.mutation({
      query: (formData) => ({
        url: ENDPOINTS.SUBMIT_BOOTCAMP_FORM,
        method: "POST",
        body: formData,
      }),
      // Invalidate the bootcamp count so it fetches the fresh count instantly after enrollment
      invalidatesTags: ["BootcampCount"],
    }),
    getHackathons: builder.query({
      query: (status) => (status ? `${ENDPOINTS.HACKATHONS}?status=${status}` : ENDPOINTS.HACKATHONS),
      providesTags: ["Hackathons"],
    }),
    getHackathonBySlug: builder.query({
      query: (slug) => `${ENDPOINTS.HACKATHONS}/${slug}`,
      providesTags: ["Hackathons"],
    }),
    submitHackathonRegistration: builder.mutation({
      query: (formData) => ({
        url: ENDPOINTS.SUBMIT_HACKATHON_REGISTRATION,
        method: "POST",
        body: formData,
      }),
      // Invalidate the hackathon count so it fetches the fresh count instantly after registration
      invalidatesTags: ["HackathonCount"],
    }),
    getHackathonCount: builder.query({
      query: (hackathonId) => `${ENDPOINTS.COUNT_HACKATHON}/${hackathonId}`,
      providesTags: ["HackathonCount"],
    }),
    getLeaderboard: builder.query({
      query: (hackathonId) => `${ENDPOINTS.HACKATHONS}/${hackathonId}/leaderboard`,
      providesTags: ["HackathonLeaderboard"],
    }),
  }),
});

export const {
  useGetTechnologiesQuery,
  useGetRegistrationCountQuery,
  useSubmitRegistrationMutation,
  useGetBootcampCountQuery,
  useSubmitBootcampRegistrationMutation,
  useGetHackathonsQuery,
  useGetHackathonBySlugQuery,
  useSubmitHackathonRegistrationMutation,
  useGetHackathonCountQuery,
  useGetLeaderboardQuery,
} = apiSlice;
