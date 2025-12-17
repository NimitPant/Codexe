import { useEffect, useState } from "react";
import axiosConfig from "../utils/axiosConfig";

export const useAxios = (axiosParams) => {
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    //const { method, url, headers } = params;
    try {
      const result = await axiosConfig.request(params);
      //const result=await axiosConfig[method](url, headers);
      setResponse(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { response, error, loading };
};
