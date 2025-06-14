import type { APIResponse } from "@/model/APIResponse";
import type { Category, CategoryResponse } from "@/model/Category";
import api from "./api";
import type {Product} from "@/model/Product.ts";

export default {
    getCategories: async (): Promise<CategoryResponse[]> => {
        const response = await api.get<APIResponse<CategoryResponse[]>>("/categories");
        return response.result;
    },

    getCategoryById: async (id: number) => {
        const response = await api.get<APIResponse<Category>>(`/categories/${id}`);
        // console.log(response);
        return response.result;
    },
    getProductsByCategory: async (cateId: number) => {
        const response = await api.get<APIResponse<Product[]>>(
            `/categories/${cateId}/products`
        );
        return response.result;
    },
}