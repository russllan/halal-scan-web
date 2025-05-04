import axios from "axios";

export const base_url = 'http://localhost:3000';
// export const base_url = 'https://halal-scan-server-production.up.railway.app/';

const $api = axios.create({
    baseURL: base_url,
    withCredentials: false,
});

export default $api;