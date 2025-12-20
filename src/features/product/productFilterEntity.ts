export interface ProductFilterEntity {
    page : number;
    limit : number;
    sortKey : string;
    asc? : boolean | null;
    term? : string | null;
    category? : string | null;
    priceMin? : number | null;
    priceMax? : number | null;
    inStock? : boolean | null;
}

