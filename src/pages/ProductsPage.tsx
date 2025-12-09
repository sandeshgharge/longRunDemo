// src/pages/ProductPage.tsx

import { useEffect, useState } from "react"
import { fetchProducts } from "../hooks/useProducts"
import type { ProductDetails } from "../entities/productDetails";


export default function ProductPage() {

    const [products, setProducts] = useState<ProductDetails[]>([]);

    useEffect(() => {
        fetchProducts({
            page: 1,
            limit: 10,
            sortKey: 'name',
            asc: true
        }).then(result => {
            console.log(result)
            setProducts(result.rows)
        }).catch(err => {
            console.error(err)
        })
    }, [])


    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {products.map((product, index) => (
                            <tr key={product.id} className={'hover:bg-base-300'}>
                                <th>{index + 1}</th>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
