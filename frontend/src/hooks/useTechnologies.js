import { useGetTechnologiesQuery } from "../api/apiSlice";

const useTechnologies = () => {
  const { data, isLoading, error, refetch } = useGetTechnologiesQuery();

  let mappedError = null;
  if (error) {
    if (error.status) {
      mappedError = `Server error: ${error.status} - ${JSON.stringify(error.data || "")}`;
    } else {
      mappedError = error.message || "Failed to load technologies. Please try again.";
    }
  } else if (data && !Array.isArray(data)) {
    mappedError = data.error || data.message || "Failed to load technologies. Unexpected API response format.";
  }

  return {
    technologies: Array.isArray(data) ? data : [],
    loading: isLoading,
    error: mappedError,
    retryFetch: refetch,
  };
};

export default useTechnologies;