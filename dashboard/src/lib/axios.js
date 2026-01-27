import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api/v1",
  withCredentials: true,
});
