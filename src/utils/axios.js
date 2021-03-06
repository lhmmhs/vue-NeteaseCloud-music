import axios from "axios";

const BASE_URL = "/api/";

function createBaseInstance() {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  instance.interceptors.response.use(handleResponse, handleError);

  return instance;
}

function handleError(e) {
  throw e;
}

function handleResponse(response) {
  return response.data;
}

export const request = createBaseInstance();
