import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const analyzeImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/image-rag/analyze",
    formData,
  );

  return response.data;
};