import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // gửi cookie JWT
});

export default instance;
