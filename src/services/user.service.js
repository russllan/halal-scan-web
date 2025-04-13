import $api from ".";

class UserService {
    async getOne(id) {
        const response = await $api.get(`/user/${id}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/user/getAll`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/user/registration`, data);
        return response.data;
    }
    async update(id, data) {
        const response = await $api.put(`/user/update/${id}`, data);
        return response.data;
    }
    async auth(data) {
        const response = await $api.post(`/user/auth/`, data);
        return response.data;
    }
}

export default new UserService();