import $api from ".";

class EcodeService {
    async getOne(id) {
        const response = await $api.get(`/e-codes/${id}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/e-codes/get`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/e-codes/create`, data);
        return response.data;
    }
    async patch(id, data) {
        const response = await $api.put(`/e-codes/update/${id}`, data);
        return response.data;
    }
}

export default new EcodeService();