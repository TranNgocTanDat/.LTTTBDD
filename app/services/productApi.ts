import type { APIResponse } from "@/model/APIResponse";
import type { Product, ProductResponse } from "@/model/Product";
import api from "./api";

export default {
    // Lấy tất cả sản phẩm
    getProducts: async (): Promise<ProductResponse[]> => {
        const response = await api.get<APIResponse<ProductResponse[]>>("/products");
        console.log(response);
        return response.result;
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<APIResponse<Product>>(`/products/${id}`);
        console.log("Full API response: ", response);
        return response.result;
    },



    // Lấy sản phẩm theo categoryId (theo đúng endpoint backend)
    getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
        const response = await api.get<APIResponse<Product[]>>(`categories/${categoryId}`);

        return response.result;
    },

    // Tạo sản phẩm mới
    createProduct: async (productData: Partial<Product>): Promise<Product> => {
        const response = await api.post<APIResponse<Product>>("/products", productData);
        return response.result;
    },

    // Cập nhật sản phẩm theo ID
    updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
        const response = await api.put<APIResponse<Product>>(`/products/${id}`, productData);
        console.log(response);
        return response.result;
    },

    // Xóa sản phẩm theo ID
    deleteProduct: async (id: number): Promise<null> => {
        const response = await api.delete<APIResponse<null>>(`/products/${id}`);
        return response.result;
    },
};
