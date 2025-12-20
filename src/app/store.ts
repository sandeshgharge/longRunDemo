import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import productCategoryreducer from '../features/product/productCategorySlice';

const store = configureStore({ 
    reducer: {
        products: productReducer,
        productCategories: productCategoryreducer
    },

});

export default store;

// omit actual store setup

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>
// Export a reusable type for handwritten thunks
export type AppThunk = ThunkAction<void, RootState, unknown, Action>