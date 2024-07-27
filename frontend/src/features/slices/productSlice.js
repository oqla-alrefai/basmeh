import { createSlice } from '@reduxjs/toolkit'
import { getProduct, getProducts, updateProduct, deleteProduct, createProduct, removeDiscount, addDiscount } from '../Actios/productActions'

const initialState = {
  loading: false,
  product: null,
  error: null,
  success: false,
  products: [],
  resProduct:[]
}


const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers:  (builder) => {
    builder
      // .addCase(registerUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(registerUser.fulfilled, (state, { payload }) => {
      //   state.loading = false;
      //   state.success = true; // registration successful
      // })
      // .addCase(registerUser.rejected, (state, { payload }) => {
      //   state.loading = false;
      //   state.error = payload;
      // })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, payload) => {
        state.loading = false;
        state.success = true;
        console.log(payload.payload);
        state.products = state.products.filter((product) => product._id !== payload.payload);
      })
      .addCase(deleteProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload;
      })
      .addCase(getProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resProduct = payload;
      })
      .addCase(getProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.products = state.products.map((product) =>
          product._id === payload._id ? payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.products.push(payload)
      })
      .addCase(createProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDiscount.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Update the product in the state with the new discount
        state.products = state.products.map((product) =>
          product._id === payload._id ? payload : product
        );
      })
      .addCase(addDiscount.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(removeDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDiscount.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Update the product in the state by removing the discount
        state.products = state.products.map((product) =>
          product._id === payload._id ? { ...product, discount: undefined } : product
        );
      })
      .addCase(removeDiscount.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
})

export default productSlice.reducer