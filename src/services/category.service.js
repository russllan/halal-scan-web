import $api from ".";

class CategoryService {
    async getOne(id) {
        const response = await $api.get(`/category/${id}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/category/get`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/category/create`, data);
        return response.data;
    }
    async patch(data) {
        const response = await $api.put(`/category/${data.id}`, data.data);
        return response.data;
    }
}

export default new CategoryService();