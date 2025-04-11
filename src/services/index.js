import axios from "axios";

export const base_url = 'http://localhost:3000';

const $api = axios.create({
    baseURL: base_url,
    withCredentials: false,
});

export default $api;