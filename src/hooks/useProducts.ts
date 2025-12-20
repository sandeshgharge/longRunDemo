import type { ProductFilterEntity } from '../features/product/productFilterEntity';
import { supabase } from '../lib/supabase'
export type SortKey =
  | 'name'
  | 'price'
  | 'stock_quantity'
  | 'created_at'
  | 'category';


export async function fetchProducts(opts: ProductFilterEntity) {
    const { page, limit, term, category, priceMin, priceMax, inStock, sortKey, asc } = opts
    const from = (page - 1) * limit; const to = from + limit - 1

    let q = supabase.from('products').select('*', { count: 'exact' })

    if (term?.trim()) q = q.ilike('name', `%${term.trim()}%`)
    if (category && category !== 'all') q = q.eq('category', category)
    if (priceMin != null) q = q.gte('price', priceMin)
    if (priceMax != null) q = q.lte('price', priceMax)
    if (inStock != null) q = inStock ? q.gt('stock_quantity', 0) : q.eq('stock_quantity', 0)

    q = q.order(sortKey, { ascending: asc? asc : true }).range(from, to)
    
    const { data, count, error } = await q
    if (error) throw error
    return { rows: data ?? [], total: count ?? 0 }
}

export async function fetchCategories() {
    let q = supabase.from('products').select('category')
    const { data, error } = await q
    if (error) throw error
    return data?.map((row) => row.category) ?? []
}