import axios from "axios"

const BASE_URL = "http://localhost:3000"

function createBaseInstance() {
  const instance = axios.create({
    baseURL: BASE_URL,
  })

  instance.interceptors.response.use(handleResponse, handleError)

  return instance
}

function handleError(e) {
  confirm(e.message, "出错啦~")
  throw e
}

function handleResponse(response) {
  return response.data
}

export const request = createBaseInstance()
