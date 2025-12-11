// src/pages/ProductPage.tsx

import { useEffect, useMemo, useState } from "react"
import { fetchCategories, fetchProducts, type SortKey } from "../hooks/useProducts"
import type { ProductDetails } from "../entities/productDetails";
import { SortIcon } from "../components/sortingIcon";
import { SearchField } from "../components/searchField";

/**
 * Utility function to generate a range of numbers
 * @param start - The start of the range (inclusive)
 * @param end - The end of the range (exclusive)
 * @returns An array of numbers from start to end
 */


/**
 * Table header interface
 * This interface defines the structure for table headers used in the ProductsPage component.
 * The data is used to render sortable table headers.
 * @interface TableHeader
 * @property {string} key - The key of the header
 * @property {boolean} sortActive - Is sorting active for this header
 * @property {"asc" | "desc"} dir - The sorting direction
 * @property {string} label - The label of the header
 */
interface TableHeader {
    key: string;
    sortActive: boolean;
    dir: "asc" | "desc";
    label: string;
}



//export default function ProductPage({ initialProducts }: { initialProducts: ProductDetails[],  count : number }) {

export default function ProductPage() {
    const [products, setProducts] = useState<ProductDetails[]>([]);
    const [page, setPage] = useState(1);

    const [limit] = useState(10);
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<{ isError: boolean, msg: string }>({ isError: false, msg: '' });

    /**
     * Fetch categories on component mount
     * This effect fetches the list of product categories from the backend
     * when the component is first mounted. The categories are stored in the
     * selectCategory state variable for use in the category filter dropdown.
     */
    useEffect(() => {
        console.log("Fetching categories");
        fetchCategories().then((cats) => {
            const catSet = new Set<string>();
            cats.forEach((c) => catSet.add(c));
            setSelectCategory(Array.from(catSet));
        }).catch((err) => {
            console.error(err);
            setError({ isError: true, msg: 'Network error. Please check your connection.' });
        });
    }, []);

    /**
     * Table headers state
     * This state variable holds the configuration for the table headers,
     * including sorting information. It is used to render the table headers
     * with sorting capabilities.
     */
    const [tableHeaders] = useState<TableHeader[]>([
        { key: 'name', sortActive: false, dir: 'asc', label: 'Name' },
        { key: 'category', sortActive: false, dir: 'asc', label: 'Category' },
        { key: 'price', sortActive: false, dir: 'asc', label: 'Price' },
        { key: 'stock_quantity', sortActive: false, dir: 'asc', label: 'Quantity' },
        { key: 'created_at', sortActive: false, dir: 'asc', label: 'Created at' },
    ]);

    /**
     * Fetch products effect
     * This effect fetches the list of products from the backend
     * whenever the page, limit, sortKey, asc, term, category,
     * priceMin, priceMax, or inStock state variables change.
     * 
     * It updates the products state variable with the fetched data
     * and handles loading and error states.
     */
    useEffect(() => {
        console.log("Fetching products")
        setIsLoading(true);
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
            setProducts(result.rows)
            setPageCount(Math.ceil(result.total / limit))
            setPaginationNumber(page)
            setError({ isError: false, msg: '' });
        }).catch(err => {
            console.error(err);
            setError({ isError: true, msg: 'Network error. Please check your connection.' });
        }).finally(() => {
            setIsLoading(false);
        })
    }, [page, limit, sortKey, asc, term, category, priceMin, priceMax, inStock])

    /**
     * Warning memoization
     * This memoized value checks for warning conditions based on the
     * current products list and sorting key. It returns a warning message
     * if there are no products matching the current filters or search term.
     */
    const warning = useMemo(() => {
        console.log("Warning check called");
        let warningMsg = '';
        if (products.length === 0) {
            switch (sortKey) {
                case 'name':
                    warningMsg = 'No products match the search term.';
                    break;
                case 'price':
                    warningMsg = 'Minimum price filter is greater than maximum price filter.';
                    break;
                case 'category':
                    warningMsg = 'No products found in the selected category.';
                    break;
                default:
                    warningMsg = 'No products found with the applied filters.';
            }
            return { isWarning: true, msg: warningMsg };
        }
        else {
            return { isWarning: false, msg: '' };
        }
    }, [products]);


    /**
     * This method handles page click events for pagination.
     * @param pageNum 
     * @param alterValue 
     * @returns 
     */
    const handlePageClick = (pageNum: number, alterValue: number) => {
        console.log("Handle page click:", pageNum, alterValue);
        if (alterValue > 0)
            setPaginationNumber(pageNum === pageCount - 3 ? pageCount - 3 : paginationNumber + 1);
        else if (alterValue < 0)
            setPaginationNumber(pageNum === 1 ? 1 : paginationNumber - 1);
        else {
        }
        if (pageNum === page) return;
        setPage(pageNum);

    }


    /**
     * This method handles name search input changes.
     * Once the user types in the search field, it updates the products list
     * based on the search term.
     * 
     * @returns
     */
    const handleNameSearch = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerm(value);
        setPage(1);
        setPaginationNumber(1);
    }

    /**
     * This method handles category selection changes.
     * Once the user selects a category, it updates the products list
     * based on the selected category.
     * @returns 
     */
    const handleCategoryChange = () => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "Select Category") {
            setCategory(undefined);
            return;
        }
        setCategory(value);
        setPage(1);
        setPaginationNumber(1);
    }

    /**
     * This method handles minimum price filter input changes.
     * Once the user types in the minimum price field, it updates the products list
     * based on the minimum price filter.
     * @returns 
     */
    const handleMinPriceFilter = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPriceMin(Number(value));
        setPage(1);
        setPaginationNumber(1);
    }

    /**
     * This method handles maximum price filter input changes.
     * Once the user types in the maximum price field, it updates the products list
     * based on the maximum price filter.
     * @returns 
     */
    const handleMaxPriceFilter = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPriceMax(Number(value));
        setPage(1);
        setPaginationNumber(1);
    }

    /**
     * This method handles in-stock checkbox changes.
     * Once the user toggles the in-stock checkbox, it updates the products list
     * based on the in-stock filter.
     * 
     * Products in stock are displayed when the checkbox is checked,
     * and all products are displayed when it is unchecked.
     * @returns 
     */
    const handleInStock = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setInStock(checked ? true : undefined);
        setPage(1);
        setPaginationNumber(1);
    }

    /**
     * This method handles sorting when a table header is clicked.
     * It updates the sortKey and asc state variables to reflect
     * the new sorting criteria.
     * @param key 
     * @returns 
     */
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


                {error.isError &&
                    <div role="alert" className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error.msg}</span>
                    </div>

                }

                {warning.isWarning && !error.isError &&
                    <div role="alert" className="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{warning.msg}</span>
                    </div>
                }
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            {tableHeaders.map((header) => (
                                <th key={header.key} onClick={handleSorting(header.key as SortKey)}>
                                    <div className="flex items-center gap-1">
                                        {header.label} <SortIcon active={sortKey === header.key} dir={sortKey === header.key ? (asc ? "asc" : "desc") : "asc"} />
                                    </div>
                                </th>
                            )
                            )}

                        </tr>
                    </thead>
                    <tbody>
                        {/* filter row */}

                        <tr>
                            <td></td>
                            <td>
                                <SearchField handleSearch={handleNameSearch()} />
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

                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={`s-${i}`}>
                                    <th><div className="skeleton h-4 w-6" /></th>
                                    <td><div className="skeleton h-4 w-40" /></td>
                                    <td><div className="skeleton h-4 w-32" /></td>
                                    <td><div className="skeleton h-4 w-20" /></td>
                                    <td><div className="skeleton h-4 w-16" /></td>
                                    <td><div className="skeleton h-4 w-28" /></td>
                                </tr>
                            ))
                        ) :
                            products.map((product, index) => (
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
                                    {[...Array(pageCount)].map((_, i) => (
                                        <>
                                            <button className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                                        </>
                                    )
                                        
                                    )}
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