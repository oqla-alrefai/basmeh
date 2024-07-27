import { createSlice } from '@reduxjs/toolkit';
import { addItemToCart, removeItemFromCart, checkout } from '../Actios/cartAction';

const initialState = {
  loading: false,
  cart: null,
  error: null,
  success: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart = payload;
      })
      .addCase(addItemToCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart = payload;
      })
      .addCase(removeItemFromCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.cart = null;
      })
      .addCase(checkout.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default cartSlice.reducer;
