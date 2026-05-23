// Configuration for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://internship.dawoodtechnextgen.com";

const ENDPOINTS = {
    SUBMIT_FORM: "/api/registration",
    GET_TECHNOLOGIES: "/api/technologies",
    COUNT_REG: "/api/count-register",
};

export { API_BASE_URL, ENDPOINTS };