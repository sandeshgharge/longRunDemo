// src/pages/ProductPage.tsx

import { useEffect, useMemo, useState } from "react"
import { fetchProducts, type SortKey } from "../hooks/useProducts"
import type { ProductDetails } from "../entities/productDetails";



//export default function ProductPage({ initialProducts }: { initialProducts: ProductDetails[],  count : number }) {

export default function ProductPage() {
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [asc, setAsc] = useState(true);
    const [term, setTerm] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
    const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [pageCount, setPageCount] = useState<number>(0);
    const [paginationNumber, setPaginationNumber] = useState<number>(0);
    const [selectCategory, setSelectCategory] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts({
            page,
            limit,
            sortKey,
            asc,
            term,
            category,
            priceMin,
            priceMax,
            inStock,
        }).then(result => {
            console.log(result)
            setProducts(result.rows)
            setPageCount(Math.ceil(result.total / limit))
            setPaginationNumber(page)

        }).catch(err => {
            console.error(err)
        })
    }, [page, limit, sortKey, asc, term, category, priceMin, priceMax, inStock])

    useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => set.add(p.category));
        setSelectCategory(Array.from(set).sort((a, b) => a.localeCompare(b)));
    }, [products]);

    const handlePageClick = (pageNum: number, alterValue: number) => {
        if (alterValue > 0)
            setPaginationNumber(pageNum === pageCount - 3 ? pageCount - 3 : paginationNumber + 1);
        else if (alterValue < 0)
            setPaginationNumber(pageNum === 1 ? 1 : paginationNumber - 1);
        else {
        }
        if (pageNum === page) return;
        setPage(pageNum);

    };

    const handleNameSearch = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerm(value);
        setPage(1);
        setPaginationNumber(1);
    }

    const handleCategoryChange = () => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if(value === "Select Category"){
            setCategory(undefined);
            return;
        }
        setCategory(value);
        setPage(1);
        setPaginationNumber(1);
    }

    const handleMinPriceFilter = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPriceMin(Number(value));
        setPage(1);
        setPaginationNumber(1);
    }

    const handleMaxPriceFilter = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPriceMax(Number(value));
        setPage(1);
        setPaginationNumber(1);
    }

    const handleInStock = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setInStock(checked ? true : undefined);
        setPage(1);
        setPaginationNumber(1);
    }
    
    const handleSorting = (key: SortKey) => () => {
        if (key === sortKey) {
            setAsc(!asc);   
        } else {
            setSortKey(key);
            setAsc(true);
        }
    }

    return (
        <div className="flex">
            <div className="overflow-x-auto  justify-center">
                <header className="p-4 border-b">Inventory Dashboard</header>
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={handleSorting('name')}>Name</th>
                            <th onClick={handleSorting('category')}>Category</th>
                            <th onClick={handleSorting('price')}>Price</th>
                            <th onClick={handleSorting('stock_quantity')}>Quantity</th>
                            <th onClick={handleSorting('created_at')}>Created at</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>
                                <label className="input">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.3-4.3"></path>
                                        </g>
                                    </svg>
                                    <input type="search" className="grow" placeholder="Search" onChange={handleNameSearch()} />

                                </label>
                            </td>
                            <td>
                                <select defaultValue="Select Category" className="select" onChange={handleCategoryChange()}>
                                    <option key={undefined}>Select Category</option>
                                    {selectCategory.map((category) => (
                                        <option key={category}>{category}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <div className="join">
                                    <input type="number" placeholder="Min" className="input" onChange={handleMinPriceFilter()} />
                                    <input type="number" placeholder="Max" className="input" onChange={handleMaxPriceFilter()} />
                                </div>
                            </td>
                            <td><input type="checkbox" className="toggle" onChange={handleInStock()} />In stock</td>
                            <td></td>
                        </tr>
                        {/* row 1 */}
                        {products.map((product, index) => (
                            <tr key={product.id} className={'hover:bg-base-300'}>
                                <th>{index + 1}</th>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                                <td>{product.created_at}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2}>
                                <div className="join">
                                    <button className="join-item btn" onClick={() => handlePageClick(paginationNumber, -1)}>{paginationNumber}</button>
                                    <button className="join-item btn" onClick={() => handlePageClick(paginationNumber + 1, 1)}>{paginationNumber + 1}</button>
                                    <button className="join-item btn btn-disabled">...</button>
                                    <button className="join-item btn" onClick={() => handlePageClick(pageCount - 1, 0)}>{pageCount - 1}</button>
                                    <button className="join-item btn" onClick={() => handlePageClick(pageCount, 0)}>{pageCount}</button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td colSpan={2}>
                                <div className="join grid grid-cols-2 justify-end">
                                    <button className="join-item btn btn-outline" onClick={() => handlePageClick(page - 1, 0)}>Previous page</button>
                                    <button className="join-item btn btn-outline" onClick={() => handlePageClick(page + 1, 0)}>Next</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/*
export async function getStaticProps() {
    try {
        const result = await fetchProducts({
            page: 1,
            limit: 10,
            sortKey: 'name',
            asc: true,
        });
        
        return {
            props: {
                initialProducts: result.rows,
                count: result.total,
            },
            revalidate: 60, // ISR: revalidate every 60 seconds
        };
    } catch (err) {
        console.error(err);
        return {
            props: {
                initialProducts: [],
                count: 0,
            },
        };
    }
}*/