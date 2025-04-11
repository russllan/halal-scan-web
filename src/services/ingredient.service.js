import $api from ".";

class IngredientService {
    async getOne(id) {
        const response = await $api.get(`/ingredient/${id}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/ingredient/get`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/ingredient/create`,data);
        return response.data;
    }
    async patch(id, data) {
        const response = await $api.put(`/ingredient/update/${id}`, data);
        return response.data;
    }
}

export default new IngredientService();