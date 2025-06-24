import httpClient from "../clients/httpClient";
import AuthService from "./authService";

const noteService = {
  /**
   * Fetch all notes for the authenticated user
   */
  getNotes: async () => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get notes error:", error);
      throw error.response?.data || { error: "Failed to get notes" };
    }
  },

  /**
   * Fetch a single note by ID
   * @param {number} id - Note ID
   */
  getNote: async (id) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.get(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get note error:", error);
      throw error.response?.data || { error: "Failed to get note" };
    }
  },

  /**
   * Fetch only active (non-archived) notes
   */
  getActiveNotes: async () => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.get("/notes/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get active notes error:", error);
      throw error.response?.data || { error: "Failed to get active notes" };
    }
  },

  /**
   * Fetch only archived notes
   */
  getArchivedNotes: async () => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.get("/notes/archived", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Get archived notes error:", error);
      throw error.response?.data || { error: "Failed to get archived notes" };
    }
  },

  /**
   * Create a new note
   * @param {string} title - Note title
   * @param {string} [content] - Optional note content
   * @param {Array} [category_ids] - Array of category IDs
   */
  createNote: async (title, content, category_ids = []) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.post(
        "/notes",
        { title, content, category_ids },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Create note error:", error);
      throw error.response?.data || { error: "Failed to create note" };
    }
  },

  /**
   * Update an existing note
   * @param {number} id - Note ID
   * @param {Object} data - Update data (title, content, archived, category_ids)
   */
  updateNote: async (id, data) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.put(`/notes/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Update note error:", error);
      throw error.response?.data || { error: "Failed to update note" };
    }
  },

  /**
   * Delete a note
   * @param {number} id - Note ID to delete
   */
  deleteNote: async (id) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Delete note error:", error);
      throw error.response?.data || { error: "Failed to delete note" };
    }
  },

  /**
   * Archive a note
   * @param {number} id - Note ID to archive
   */
  archiveNote: async (id) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.patch(
        `/notes/${id}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Archive note error:", error);
      throw error.response?.data || { error: "Failed to archive note" };
    }
  },

  /**
   * Unarchive a note
   * @param {number} id - Note ID to unarchive
   */
  unarchiveNote: async (id) => {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("Authentication required");

      const response = await httpClient.patch(
        `/notes/${id}/unarchive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Unarchive note error:", error);
      throw error.response?.data || { error: "Failed to unarchive note" };
    }
  },
};

export default noteService;
