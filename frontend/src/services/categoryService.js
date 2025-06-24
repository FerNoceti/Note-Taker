import httpClient from "../clients/httpClient";
import AuthService from "./authService";

const categoryService = {
  /**
   * Fetch all categories for the authenticated user
   */
  getCategories: async () => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get categories error:", error);
      throw error.response?.data || { error: "Failed to get categories" };
    }
  },

  /**
   * Create a new category
   * @param {string} name - Category name
   */
  createCategory: async (name) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.post(
        "/categories",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Create category error:", error);
      throw error.response?.data || { error: "Failed to create category" };
    }
  },

  /**
   * Update an existing category
   * @param {number} id - Category ID
   * @param {Object} data - Update data (name)
   */
  updateCategory: async (id, data) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.put(`/categories/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Update category error:", error);
      throw error.response?.data || { error: "Failed to update category" };
    }
  },

  /**
   * Delete a category
   * @param {number} id - Category ID to delete
   */
  deleteCategory: async (id) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Delete category error:", error);
      throw error.response?.data || { error: "Failed to delete category" };
    }
  },
};

export default categoryService;
