import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://peddadameals.herokuapp.com/"
})