import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_CONFIG from '../constants/api.js';

const useTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTechnologies = useCallback(async (retry = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TECHNOLOGIES}`,
        {
          timeout: API_CONFIG.TIMEOUT,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response)

      if (
        response.data &&
        response.data.techs &&
        Array.isArray(response.data)
      ) {
        setTechnologies(response.data);
      } else {
        setTechnologies(response.data);
      }
    } catch (err) {
      console.error("Error fetching technologies:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else if (err.response) {
        setError(
          `Server error: ${err.response.status} - ${err.response.statusText}`,
        );
      } else if (err.request) {
        setError("Cannot connect to server. Please ensure the API is running.");
      } else {
        setError("Failed to load technologies. Please try again.");
      }

      if (retry < 2) {
        setTimeout(
          () => {
            fetchTechnologies(retry + 1);
          },
          1000 * (retry + 1),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies, retryCount]);

  const retryFetch = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return { technologies, loading, error, retryFetch };
};

export default useTechnologies;