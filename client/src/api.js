import axios from "axios";

export const API_BASE = "http://localhost:5000";

export function makeApi(token) {
    return axios.create({
        baseURL: API_BASE,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}