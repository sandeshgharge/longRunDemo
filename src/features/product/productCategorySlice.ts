import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/thunkWithTypes";
import { fetchCategories } from "../../hooks/useProducts";

export const productCategorySlice = createSlice({
    name: 'productCategories',
    initialState: {
        categories: [] as string[]
    },
    reducers: {
    }
});


export const fetchDistinctCategories = createAppAsyncThunk(
    'products/fetchCategories',
    async () => {
        const response = await fetchCategories();
        return response;
    }
);

export default productCategorySlice.reducer;