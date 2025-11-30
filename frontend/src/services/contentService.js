import api from '../lib/api';

const contentService = {
    /**
     * Get all published content
     * @param {Object} params - Filter parameters
     * @returns {Promise} Content list
     */
    getAll: async (params = {}) => {
        const response = await api.get('/content', { params });
        return response.data;
    },

    /**
     * Get content by slug
     * @param {string} slug
     * @returns {Promise} Content with blocks
     */
    getBySlug: async (slug) => {
        const response = await api.get(`/content/${slug}`);
        return response.data;
    },

    /**
     * Get content by category
     * @param {string} category
     * @param {Object} params
     * @returns {Promise} Content list
     */
    getByCategory: async (category, params = {}) => {
        const response = await api.get(`/content/category/${category}`, { params });
        return response.data;
    },

    // Admin endpoints
    admin: {
        /**
         * Get all content (including drafts)
         */
        getAll: async (params = {}) => {
            const response = await api.get('/content/admin', { params });
            return response.data;
        },

        /**
         * Get content by ID
         */
        getById: async (id) => {
            const response = await api.get(`/content/admin/${id}`);
            return response.data;
        },

        /**
         * Create content
         */
        create: async (contentData) => {
            const response = await api.post('/content/admin', contentData);
            return response.data;
        },

        /**
         * Update content
         */
        update: async (id, contentData) => {
            const response = await api.put(`/content/admin/${id}`, contentData);
            return response.data;
        },

        /**
         * Delete content
         */
        delete: async (id) => {
            const response = await api.delete(`/content/admin/${id}`);
            return response.data;
        },

        /**
         * Publish content
         */
        publish: async (id) => {
            const response = await api.post(`/content/admin/${id}/publish`);
            return response.data;
        },

        /**
         * Unpublish content
         */
        unpublish: async (id) => {
            const response = await api.post(`/content/admin/${id}/unpublish`);
            return response.data;
        },

        // Block operations
        blocks: {
            /**
             * Add block to content
             */
            add: async (contentId, blockData) => {
                const response = await api.post(`/content/admin/${contentId}/blocks`, blockData);
                return response.data;
            },

            /**
             * Update block
             */
            update: async (blockId, blockData) => {
                const response = await api.put(`/content/admin/blocks/${blockId}`, blockData);
                return response.data;
            },

            /**
             * Delete block
             */
            delete: async (blockId) => {
                const response = await api.delete(`/content/admin/blocks/${blockId}`);
                return response.data;
            },

            /**
             * Reorder blocks
             */
            reorder: async (contentId, blocks) => {
                const response = await api.put(`/content/admin/${contentId}/blocks/reorder`, { blocks });
                return response.data;
            }
        }
    }
};

export default contentService;
