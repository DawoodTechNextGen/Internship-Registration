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
  }

  return {
    technologies: data || [],
    loading: isLoading,
    error: mappedError,
    retryFetch: refetch,
  };
};

export default useTechnologies;