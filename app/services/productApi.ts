import type { APIResponse } from "@/model/APIResponse";
import type { Product, ProductRequest, ProductResponse } from "@/model/Product";
import api from "./api";

export default {
    // Lấy tất cả sản phẩm
    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await api.get<APIResponse<ProductResponse[]>>("/products/all");
        console.log(response);
        return response.result;
    },

    getProducts: async (limit: number, offset: number): Promise<ProductResponse[]> => {
        const response = await api.get<APIResponse<ProductResponse[]>>("/products", {
            params: { limit, offset },
        });
        console.log("response.data", response);
        return response.result;
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<APIResponse<Product>>(`/products/${id}`);
        console.log("Full API response: ", response);
        return response.result;
    },

    searchGames: async (keyword: string): Promise<ProductResponse[]> => {
        const response = await api.get<APIResponse<ProductResponse[]>>("/products/search", { params: { keyword } })
        return response.result;
    },



    // Lấy sản phẩm theo categoryId (theo đúng endpoint backend)
    getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
        const response = await api.get<APIResponse<Product[]>>(`categories/${categoryId}`);

        return response.result;
    },

    // Tạo sản phẩm mới
    createProduct: async (productData:ProductRequest):  Promise<ProductResponse> => {
        const response = await api.post<APIResponse<ProductResponse>>("/products", productData);
        console.log(response);
        return response.result;
    },

    // Cập nhật sản phẩm theo ID
    updateProduct: async (id: number, productData: ProductRequest): Promise<ProductResponse> => {
        const response = await api.put<APIResponse<ProductResponse>>(`/products/${id}`, productData);
        console.log(response);
        return response.result;
    },

    // Xóa sản phẩm theo ID
    deleteProduct: async (id: number): Promise<null> => {
        const response = await api.delete<APIResponse<null>>(`/products/${id}`);
        return response.result;
    },
};