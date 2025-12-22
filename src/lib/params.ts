export function readParams(sp: URLSearchParams) {
    return {
        term: sp.get('q') || '',
        category: sp.get('category') || 'all',
        priceMin: sp.get('min') ? Number(sp.get('min')) : undefined,
        priceMax: sp.get('max') ? Number(sp.get('max')) : undefined,
        inStock: sp.get('stock') === 'in',
        sortKey: (sp.get('sort') || 'created_at') as any,
        asc: sp.get('asc') === '1',
        page: Math.max(1, Number(sp.get('page') || '1')),
    }
}

export function writeParams(next: Partial<ReturnType<typeof readParams>>, prev: URLSearchParams) {
    const sp = new URLSearchParams(prev)
    const set = (k: string, v?: string | number | boolean) => {
        if (v === undefined || v === '' || v === false) sp.delete(k)
        else sp.set(k, String(v))
    }
    set('q', next.term == '' ? undefined : next.term)
    set('category', next.category && next.category !== 'all' ? next.category : undefined)
    set('min', next.priceMin)
    set('max', next.priceMax)
    set('stock', next.inStock ? 'in' : undefined)
    set('sort', next.sortKey)
    set('asc', next.asc ? '1' : undefined)
    set('page', next.page)
    return sp
}