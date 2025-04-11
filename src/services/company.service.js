import $api from ".";

class CompanyService {
    async getOne(id) {
        const response = await $api.get(`/company/${id}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/company/get`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/company/create`, data);
        return response.data;
    }
    async patch(id, data) {
        const response = await $api.put(`/company/update/${id}`, data);
        return response.data;
    }
}

export default new CompanyService();