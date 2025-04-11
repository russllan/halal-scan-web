import $api from ".";

class BasketService {
    async clearBasket(userId) {
        const response = await $api.get(`/basket/clear/${userId}`);
        return response.data;
    }
    async getAll(userId) {
        const response = await $api.get(`/basket/get/${userId}`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/basket/create`, data);
        return response.data;
    }
    async remove(userId, productId) {
        const response = await $api.delete(`/basket/delete/${userId}/${productId}`);
        return response.data;
    }
    async getOne(userId, productId) {
        const response = await $api.get(`/basket/getOne/${userId}/${productId}`);
        return response.data;
    }
}

export default new BasketService();