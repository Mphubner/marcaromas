import { createClient } from '@supabase/supabase-js';

// Supabase client (opcional - se quiser usar recursos além do PostgreSQL)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role no backend

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    console.log('[Supabase] Client initialized');
} else {
    console.warn('[Supabase] Client not configured - missing env vars');
}

/**
 * Get Supabase client instance
 * Use apenas se precisar de recursos específicos do Supabase (Storage, Realtime, etc)
 * Para queries normais, use o Prisma
 */
export const getSupabaseClient = () => {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    return supabase;
};

/**
 * Upload file to Supabase Storage
 * @param {string} bucket - Nome do bucket
 * @param {string} path - Path do arquivo
 * @param {File|Buffer} file - Arquivo para upload
 */
export const uploadFile = async (bucket, path, file) => {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('[Supabase Storage] Upload error:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return {
        path: data.path,
        publicUrl
    };
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFile = async (bucket, path) => {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error('[Supabase Storage] Delete error:', error);
        throw error;
    }

    return true;
};

/**
 * Get signed URL for private file
 */
export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) {
        console.error('[Supabase Storage] Signed URL error:', error);
        throw error;
    }

    return data.signedUrl;
};

/**
 * List files in Supabase Storage
 */
export const listFiles = async (bucket, path = '', options = {}) => {
    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
            limit: options.limit || 100,
            offset: options.offset || 0,
            sortBy: options.sortBy || { column: 'name', order: 'asc' },
        });

    if (error) {
        console.error('[Supabase Storage] List error:', error);
        throw error;
    }

    return data;
};

export default {
    getSupabaseClient,
    uploadFile,
    deleteFile,
    getSignedUrl,
    listFiles
};
