import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not configured. Storage features will use local fallback.');
}

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const STORAGE_BUCKET = 'product-images';

export const listFiles = async (bucket, path = '') => {
    if (!supabase) return [];

    const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

    if (error) throw error;
    return data;
};
