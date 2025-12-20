import type { ProductDetails } from '../../entities/productDetails';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductFilterEntity } from './productFilterEntity';
import { createAppAsyncThunk } from '../../app/thunkWithTypes';
import { fetchProducts } from '../../hooks/useProducts';
import type { RootState } from '../../app/store';

interface ProductListState {
    productList: ProductDetails[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    count: number;
    error: string | null;
}

const initialState: ProductListState = {
    productList: [],
    count: 0,
    status: 'idle',
    error: null
}

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilteredProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilteredProducts.fulfilled, (state, action: PayloadAction<{ rows: ProductDetails[]; total: number; }>) => {
                state.status = 'succeeded';
                state.productList = action.payload.rows;
                state.count = action.payload.total;
                state.status = 'idle';
            })
            .addCase(fetchFilteredProducts.rejected, (state, action) => {
                console.error('Failed to fetch products:', action.error);
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            });
    }
})

export const fetchFilteredProducts: any = createAppAsyncThunk(
    'products/fetchProducts',
    async (filterObj: ProductFilterEntity) => {
        const response = await fetchProducts(filterObj);
        return response;
    },
    {
        condition(arg, thunkApi) {
            const postsStatus = selectProductStatus(thunkApi.getState());
            if (arg && postsStatus !== 'idle') {
                return false
            }
        }
    }
);

export const selectAllProducts = (state: RootState) => state.products.productList;
export const selectProductStatus = (state: RootState) => state.products.status;
export const selectProductCount = (state: RootState) => state.products.count;
export const selectProductError = (state: RootState) => state.products.error;

export default productSlice.reducer