import $api from ".";

class ProductService {
    async getOne(barcode) {
        const response = await $api.get(`/product/get/${barcode}`);
        return response.data;
    }
    async getAll() {
        const response = await $api.get(`/product/get`);
        return response.data;
    }
    async getByBarcode(barcode) {
        const response = await $api.get(`product/get/bybarcode/${barcode}`);
        return response.data;
    }
    async create(data) {
        const response = await $api.post(`/product/create`, data);
        return response.data;
    }
    async update(id, data) {
        const response = await $api.put(`/product/update/${id}`, data);
        return response.data;
    }
    async remove(id) {
        const response = await $api.put(`/product/remove/${id}`);
        return response.data;
    }
}

export default new ProductService();